import { ref, computed } from 'vue'

const jobs = ref([])
const operationBatches = ref([])
const showAllJobs = ref(false)
const workstation = ref(null)
const operation = ref({
  id: '',
  name: '',
  isBatch: null
})

const showAllJobsFilterFn = (job) => showAllJobs.value || job.seq === 1 ? true : Boolean(job.qtyInput)

const unassignedJobs = computed(() => {
  return jobs.value
    .filter(job => job.operation.id === operation.value.id)
    .filter(job => !job.workstation)
    .filter(showAllJobsFilterFn)
})

const currentJobs = computed(() => {
  return jobs.value
    .filter(job => job.operation.id === operation.value.id)
    .filter(job => job.workstation)
    .filter(job => workstation.value ? job.workstation.id === workstation.value.id : true)
    .filter(showAllJobsFilterFn)
})

const currentOperationBatches = computed(() => {
  return operationBatches.value
    .filter(operationBatch => operationBatch.operationId === operation.value.id)
    .filter(operationBatch => workstation.value ? operationBatch.workstation.id === workstation.value.id : true)
})

export const useProductionExecution = () => {
  const updateJob = (data) => {
    const index = jobs.value.findIndex(({ id }) => data.id === id)
    Object.assign(jobs.value[index], data)

    if (data.operationBatchId) {
      const operationBatch = operationBatches.value.find(({ id }) => data.operationBatchId === id)
      operationBatch.jobCount++
    }
  }
  
  const createProductionRecord = (productionRecord) => {
    const job = jobs.value.find(
      ({ productionOrder, operation }) =>
        productionRecord.productionOrderId === productionOrder.id &&
        productionRecord.operation.id === operation.id
    )

    const keys = {
      OUTPUT: 'qtyOutput',
      REJECT: 'qtyReject',
      REWORK: 'qtyRework',
      SHORTFALL: 'qtyShortfall'
    }

    job[keys[productionRecord.type]] += productionRecord.qty

    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
    const qtyDemand = job.qtyInput - job.qtyShortfall

    job.status = qtyMade >= qtyDemand ? 'CLOSED' : 'IN_PROGRESS'
    job.timeTakenMins += productionRecord.timeTakenMins

    const nextJob = jobs.value.find(
      ({ productionOrder, seq }) =>
        productionRecord.productionOrderId === productionOrder.id &&
        job.seq === seq - 1
    )

    if (nextJob) {
      nextJob.qtyInput = job.status === 'CLOSED' ? qtyMade : 0
    }
  }

  const createOperationBatch = (operationBatch) => {
    operationBatches.value.push(operationBatch)
  }

  const startOperationBatch = ({ id }) => {
    // Implement
  }

  const deleteOperationBatch = ({ id }) => {
    operationBatches.value = operationBatches.value.filter(batch => id !== batch.id)
  }

  const initialize = (jobsArray, operationBatchesArray) => {
    jobs.value = jobsArray
    operationBatches.value = operationBatchesArray
  }

  return {
    operation,
    workstation,
    showAllJobs,
    unassignedJobs,
    currentJobs,
    currentOperationBatches,
    initialize,
    updateJob,
    createProductionRecord,
    createOperationBatch,
    startOperationBatch,
    deleteOperationBatch
  }
}