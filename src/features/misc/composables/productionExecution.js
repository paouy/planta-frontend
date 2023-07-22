import { ref, computed } from 'vue'

const operation = ref({
  id: '',
  name: '',
  isBatch: null
})
const workstation = ref(null)
const showAllJobs = ref(false)
const productionOrders = ref([])
const operationBatches = ref([])

const jobs = computed(() => {
  return productionOrders.value.flatMap(order => order.operations.map((operation, index) => {
    let qtyExpected = order.qty

    if (index > 0) {
      const previousOperation = order.operations[index - 1]
      const { output, reject, rework, adjustment } = previousOperation.tally

      qtyExpected = output - reject + rework + adjustment
    }

    const { output, reject, rework, adjustment } = operation.tally
    const qtyProduced = output - reject + rework + adjustment

    const nextJob = order.operations[index + 1]
    const isLocked = nextJob ? nextJob?.batch || nextJob?.status !== 'OPEN' : false

    const job = {
      productionOrder: {
        id: order.id,
        friendlyId: order.friendlyId
      },
      seq: parseFloat(index + 1),
      status: operation.status,
      operation: {
        id: operation.id,
        name: operation.name,
      },
      workstation: operation.workstation,
      productName: order.product.name,
      timeEstimatedMins: operation.timeEstimatedMins,
      qtyExpected,
      qtyProduced,
      isLocked
    }

    if (operation.batch) {
      job.operation.batch = operation.batch
    }

    return job
  }))
})

const showAllJobsFilterFn = (job, index) => {
  if (showAllJobs.value || job.seq === 1) {
    return true
  }
  
  const { productionOrder, status } = jobs.value[index - 1]
  return productionOrder.id === job.productionOrder.id && status !== 'OPEN'
}

const unassignedJobs = computed(() => {
  return jobs.value.filter((job, index) =>
    job.operation.id === operation.value.id &&
    !job.workstation &&
    !job.operation.batch &&
    showAllJobsFilterFn(job, index)
  )
})

const currentJobs = computed(() => {
  return jobs.value.filter((job, index) =>
    job.operation.id === operation.value.id &&
    !!job.workstation &&
    (workstation.value ? job.workstation.id === workstation.value.id : true) &&
    showAllJobsFilterFn(job, index)
  )
})

const currentOperationBatches = computed(() => {
  return operationBatches.value.filter(batch =>
    batch.operation.id === operation.value.id &&
    (workstation.value ? batch.workstation.id === workstation.value.id : true)
  )
})

export const useProductionExecution = () => {
  const updateJob = (job) => {
    const productionOrder = productionOrders.value.find(({ id }) => job.productionOrderId === id)
    const operation = productionOrder.operations.find(({ id }) => job.operationId === id)

    operation.workstation = job.workstation

    if (job.batch) {
      operation.batch = job.batch

      const operationBatch = operationBatches.value.find(({ id }) => job.batch.id === id)

      operationBatch.jobCount++
    }
  }
  
  const addProductionRecord = (productionRecord) => {
    const productionOrder = productionOrders.value.find(({ id }) => productionRecord.productionOrderId === id)
    const operation = productionOrder.operations.find(({ id }) => productionRecord.operationId === id)

    operation.tally[productionRecord.type.toLowerCase()] += productionRecord.qty
    operation.timeTakenMins += productionRecord.timeTakenMins

    const job = currentJobs.value.find(job =>
      productionRecord.productionOrderId === job.productionOrder.id &&
      productionOrder.operationId === job.operationId
    )

    operation.status = job.qtyProduced >= job.qtyExpected || productionRecord.type === 'SHORTFALL'
      ? 'CLOSED'
      : 'IN_PROGRESS'
  }

  const addOperationBatch = (operationBatch) => {
    operationBatches.value.push(operationBatch)
  }

  const startOperationBatch = ({ id }) => {
    const operationBatch = operationBatches.value.find(batch => id === batch.id)
    operationBatch.status = 'IN_PROGRESS'

    productionOrders.value.forEach(({ operations }) => {
      operations.forEach(operation => {
        if (operation.batch?.id === id) {
          operation.status = 'IN_PROGRESS'
        }
      })
    })
  }

  const initialize = ({ orders, batches }) => {
    productionOrders.value = orders
    operationBatches.value = batches
  }

  return {
    operation,
    workstation,
    showAllJobs,
    unassignedJobs,
    jobs: currentJobs,
    operationBatches: currentOperationBatches,
    initialize,
    updateJob,
    addProductionRecord,
    addOperationBatch,
    startOperationBatch
  }
}