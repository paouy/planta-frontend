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
      const { output, rework, adjustment } = order.operations[index - 1].tally

      qtyExpected = output + rework + adjustment
    }

    const { output, rework, adjustment, reject } = operation.tally
    const qtyProduced = output + rework + adjustment - reject
    const isLastSeq = index === order.operations.length - 1

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
      isLastSeq
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
    console.log(JSON.stringify(job, null, 2))
    const productionOrder = productionOrders.value.find(({ id }) => job.productionOrderId === id)
    const operation = productionOrder.operations.find(({ id }) => job.operationId === id)

    if (job.workstation) {
      operation.workstation = job.workstation
    }

    if (job.operationBatchId) {
      operation.batchId = job.operationBatchId

      const operationBatch = operationBatches.value.find(({ id }) => job.operationBatchId === id)

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
    addOperationBatch
  }
}