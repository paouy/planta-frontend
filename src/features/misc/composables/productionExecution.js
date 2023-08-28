import { ref, computed } from 'vue'

const jobs = ref([])
const operationBatches = ref([])
const showAllJobs = ref(false)
const workstation = ref(null)
const operation = ref({
  id: '',
  name: '',
  isBatch: null,
  hasEquipment: null
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
    .map(job => {
      const nextJob = jobs.value.find(
        ({ productionOrder, seq }) =>
          job.productionOrder.id === productionOrder.id &&
          job.seq === seq - 1
      )

      if (!job.qtyInput) {
        job.isLocked = true
      }

      if (nextJob?.status === 'CLOSED') {
        job.isLocked = true
      }

      if (!nextJob) {
        job.isLocked = false
      }

      return job
    })
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

    const prevJob = jobs.value.find(
      ({ productionOrder, seq }) =>
        productionRecord.productionOrderId === productionOrder.id &&
        job.seq === seq + 1
    )

    const nextJob = jobs.value.find(
      ({ productionOrder, seq }) =>
        productionRecord.productionOrderId === productionOrder.id &&
        job.seq === seq - 1
    )

    const keys = {
      OUTPUT: 'qtyOutput',
      REJECT: 'qtyReject',
      REWORK: 'qtyRework',
      SHORTFALL: 'qtyShortfall'
    }

    job[keys[productionRecord.type]] += productionRecord.qty
    job.timeTakenMins += productionRecord.timeTakenMins

    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
    const qtyDemand = job.qtyInput - job.qtyShortfall

    job.status = qtyMade >= qtyDemand ? 'CLOSED' : 'IN_PROGRESS'

    if (job.status === 'CLOSED' && job.seq > 1 && prevJob?.status !== 'CLOSED') {
      job.status = 'PAUSED'
    }

    if (nextJob) {
      nextJob.qtyInput = qtyMade
    }
  }

  const createOperationBatch = (operationBatch) => {
    operationBatches.value.push(operationBatch)
  }

  const startOperationBatch = (id) => {
    const operationBatch = operationBatches.value.find(operationBatch => operationBatch.id === id)
    operationBatch.status = 'IN_PROGRESS'

    jobs.value.forEach((job, index) => {
      if (job.operationBatchId === id) {
        jobs.value[index].status = 'IN_PROGRESS'
      }
    })
  }

  const deleteOperationBatch = (id) => {
    operationBatches.value = operationBatches.value.filter(operationBatch => operationBatch.id !== id)
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