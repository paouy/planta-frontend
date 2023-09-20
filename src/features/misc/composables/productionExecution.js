import { ref, computed } from 'vue'

const jobs = ref([])
const operationBatches = ref([])
const showAllJobs = ref(false)
const workstation = ref(null)
const operation = ref({
  id: '',
  name: '',
  hasEquipment: null,
  isBatch: null
})

const showAllJobsFilterFn = (job) => showAllJobs.value || job.seq === 1 ? true : Boolean(job.qtyInput)

const filteredJobs = computed(() => {
  return jobs.value
    .filter(job => job.operation.id === operation.value.id)
    .filter(showAllJobsFilterFn)
})

const unassignedJobs = computed(() => {
  return filteredJobs.value.filter(job => {
    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
    const qtyDemand = job.qtyInput - job.qtyShortfall
    
    const condition = qtyMade === 0 && qtyDemand === 0
      ? job.status === 'OPEN'
      : qtyDemand > qtyMade

    return job.workstation === null && condition
  })
})

const currentJobs = computed(() => {
  const unassignedJobIds = unassignedJobs.value.map(job => job.id)

  return filteredJobs.value
    .filter(job => !unassignedJobIds.includes(job.id))
    .filter(job => workstation.value ? job.workstation.id === workstation.value.id : true)
    .map(job => {
      const relatedJobs = jobs.value.filter(({ productionOrder }) => job.productionOrder.id === productionOrder.id)
      const prevJob = relatedJobs.find(({ seq }) => job.seq === seq + 1)
      const nextJob = relatedJobs.find(({ seq }) => job.seq === seq - 1)

      job.isAllowedShortfall = job.seq > 1 && prevJob.status !== 'CLOSED' ? false : true

      job.isLocked = false

      if (job.status === 'IN_PROGRESS' && job.operation.isBatch) {
        job.isLocked = true
      }

      if (job.status === 'PAUSED' && !job.operation.isBatch) {
        job.isLocked = true
      }

      if (job.status === 'CLOSED' && nextJob?.status === 'CLOSED') {
        job.isLocked = true
      }

      return job
    })
})

const currentOperationBatches = computed(() => {
  return operationBatches.value
    .filter(operationBatch => operationBatch.operationId === operation.value.id)
    .filter(operationBatch => workstation.value ? operationBatch.workstation.id === workstation.value.id : true)
    .map(operationBatch => {
      if (!operationBatch.jobCount) {
        return {
          ...operationBatch,
          size: null
        }
      }

      const operationBatchJobs = currentJobs.value.filter(job => operationBatch.id === job.operationBatchId)
      const sizeUom = operationBatchJobs[0].operation.batchSize.uom

      let sizeValue = 0

      operationBatchJobs.forEach(job => sizeValue += (job.operation.batchSize.multiplier * job.qtyInput))

      return {
        ...operationBatch,
        size: `${sizeValue.toFixed()} ${sizeUom}`
      }
    })
})

export const useProductionExecution = () => {
  const updateJob = (job) => {
    const { oldOperationBatchId, ...data } = job
    const index = jobs.value.findIndex(({ id }) => data.id === id)

    Object.assign(jobs.value[index], data)

    if (data.operationBatchId) {
      const operationBatch = operationBatches.value.find(({ id }) => data.operationBatchId === id)
      operationBatch.jobCount++
    }

    if (oldOperationBatchId) {
      const operationBatch = operationBatches.value.find(({ id }) => oldOperationBatchId === id)
      operationBatch.jobCount--
    }
  }
  
  const createProductionRecord = (productionRecord) => {
    const relatedJobs = jobs.value.filter(({ productionOrder }) =>
      productionRecord.productionOrderId === productionOrder.id
    )

    const job = relatedJobs.find(({ operation }) =>
      productionRecord.operation.id === operation.id
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

    const prevJob = relatedJobs.find(({ seq }) => job.seq === seq + 1)
    const nextJob = relatedJobs.find(({ seq }) => job.seq === seq - 1)

    if (nextJob) {
      nextJob.qtyInput = qtyMade
      nextJob.timeEstimatedMins = nextJob.operation.timePerCycleMins * (nextJob.operation.isBatch ? 1 : qtyMade)
    }

    if (job.status === 'CLOSED') {
      if (job.operation.isBatch) {
        job.workstation = null
      }

      if (job.seq > 1) {
        if (prevJob.status !== 'CLOSED') {
          job.status = 'PAUSED'
        }
    
        if (nextJob) {
          const nextJobQtyMade = nextJob.qtyOutput - nextJob.qtyReject + nextJob.qtyRework
          const nextJobQtyDemand = nextJob.qtyInput - nextJob.qtyShortfall
    
          if (nextJobQtyMade >= nextJobQtyDemand) {
            nextJob.status = 'CLOSED'
          }
        }
      }
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

  const reset = () => {
    jobs.value = []
    operationBatches.value = []
    showAllJobs.value = false
    workstation.value = null
    operation.value = {
      id: '',
      name: '',
      hasEquipment: null,
      isBatch: null
    }
  }

  return {
    operation,
    workstation,
    showAllJobs,
    unassignedJobs,
    currentJobs,
    currentOperationBatches,
    initialize,
    reset,
    updateJob,
    createProductionRecord,
    createOperationBatch,
    startOperationBatch,
    deleteOperationBatch
  }
}