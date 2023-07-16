import { ref, computed } from 'vue'

const operation = ref({
  id: '',
  name: '',
  type: ''
})
const workstation = ref(null)
const showAllProductionJobs = ref(false)
const productionJobs = ref([])
const productionBatches = ref([])

const showAllProductionJobsFilterFn = (job, index) => {
  if (showAllProductionJobs.value || job.index === 0) {
    return true
  }
  
  const { status, productionOrder } = productionJobs.value[index - 1]
  return status !== 'OPEN' && productionOrder.id === job.productionOrder.id
}

const unassignedProductionJobs = computed(() => {
  return productionJobs.value.filter((job, index) =>
    job.operation.id === operation.value.id &&
    !job.workstation &&
    !job.productionBatchId &&
    showAllProductionJobsFilterFn(job, index)
  )
})

const currentProductionJobs = computed(() => {
  return productionJobs.value.filter((job, index) =>
    job.operation.id === operation.value.id &&
    !!job.workstation &&
    (workstation.value ? job.workstation.id === workstation.value.id : true) &&
    showAllProductionJobsFilterFn(job, index)
  )
})

const currentProductionBatches = computed(() => {
  return productionBatches.value.filter(batch =>
    batch.operation.id === operation.value.id &&
    (workstation.value ? batch.workstation.id === workstation.value.id : true)
  )
})

export const useProductionExecution = () => {
  const updateProductionJob = (productionJob) => {
    const productionJobIndex = productionJobs.value
      .findIndex(({ id }) => id === productionJob.id)
  
    Object.assign(productionJobs.value[productionJobIndex], productionJob)
  
    if (productionJob.productionBatchId) {
      const productionBatchIndex = productionBatches.value
        .findIndex(({ id }) => id === productionJob.productionBatchId)
      
      productionBatches.value[productionBatchIndex].count++
    }
  }
  
  const addProductionRecord = (productionRecord) => {
    const { productionJobId, type, qty, newProductionJobStatus } = productionRecord
    const productionJobIndex = productionJobs.value
      .findIndex(({ id }) => id === productionJobId)
  
    productionJobs.value[productionJobIndex].operation.summary[type.toLowerCase()] += qty
    productionJobs.value[productionJobIndex].status = newProductionJobStatus
  
    for (let index = 1; index < productionJobs.value.length; index++) {
      const previousProductionJob = productionJobs.value[index - 1]
      const currentProductionJob = productionJobs.value[index]
  
      if (previousProductionJob.productionOrder.id === currentProductionJob.productionOrder.id) {
        productionJobs.value[index].qtyExpected =
          previousProductionJob.qtyExpected + previousProductionJob.operation.summary.shortfall
      } else {
        break
      }
    }
  }

  const initialize = ({ jobs, batches }) => {
    productionJobs.value = jobs
    productionBatches.value = batches
  }

  return {
    operation,
    workstation,
    showAllProductionJobs,
    unassignedProductionJobs,
    productionJobs: currentProductionJobs,
    productionBatches: currentProductionBatches,
    initialize,
    updateProductionJob,
    addProductionRecord
  }
}