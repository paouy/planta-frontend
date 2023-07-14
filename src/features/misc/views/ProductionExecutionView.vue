<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProductionJobs } from '../../productionJob/api/index.js'
import { getNotClosedProductionBatches } from '../../productionBatch/api/index.js'
import { CfAppView, CfAppViewHeader } from '../../../components/index.js'
import ProductionExecutionFilters from '../components/ProductionExecutionFilters.vue'
import UnassignedProductionJobsCallout from '../../productionJob/components/UnassignedProductionJobsCallout.vue'
import ProductionJobsList from '../../productionJob/components/ProductionJobsList.vue'
import ProductionBatchesList from '../../productionBatch/components/ProductionBatchesList.vue'
import AssignProductionJob from '../../productionJob/components/AssignProductionJob.vue'
import UpdateProductionJob from '../../productionJob/components/UpdateProductionJob.vue'
import AddProductionRecord from '../../productionRecord/components/AddProductionRecord.vue'
import AddShortfallProductionRecord from '../../productionRecord/components/AddShortfallProductionRecord.vue'

const operation = ref({
  id: '',
  name: '',
  type: ''
})
const workstation = ref(null)
const showJobsAwaitingInput = ref(false)
const currentAction = ref(null)

const productionJobs = ref([])
const showAssignProductionJob = ref(false)
const productionJob = ref(null)

const productionBatches = ref([])

const productionJobsAwaitingInputFilterFn = (job, index) => {
  if (showJobsAwaitingInput.value || job.index === 0) {
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
    productionJobsAwaitingInputFilterFn(job, index)
  )
})

const currentProductionJobs = computed(() => {
  return productionJobs.value.filter((job, index) =>
    job.operation.id === operation.value.id &&
    !!job.workstation &&
    (workstation.value ? job.workstation.id === workstation.value.id : true) &&
    productionJobsAwaitingInputFilterFn(job, index)
  )
})

const currentProductionBatches = computed(() => {
  return productionBatches.value.filter(batch =>
    batch.operation.id === operation.value.id &&
    (workstation.value ? batch.workstation.id === workstation.value.id : true)
  )
})

const onProductionJobsListAction = ({ action, item }) => {
  currentAction.value = action
  productionJob.value = item
}

const onUpdateProductionJobSuccess = (productionJob) => {
  const productionJobIndex = productionJobs.value.findIndex(({ id }) => id === productionJob.id)

  Object.assign(productionJobs.value[productionJobIndex], productionJob)
}

const onAddProductionRecordSuccess = (productionRecord) => {
  const { productionJobId, newProductionJobStatus, type, qty } = productionRecord
  const productionJobIndex = productionJobs.value.findIndex(({ id }) => id === productionJobId)

  productionJobs.value[productionJobIndex].status = newProductionJobStatus
  productionJobs.value[productionJobIndex].operation.summary[type.toLowerCase()] += qty

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

onMounted(async () => {
  const [jobs, batches] = await Promise.all([
    getProductionJobs(),
    getNotClosedProductionBatches()
  ])

  productionJobs.value = jobs
  productionBatches.value = batches
})
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Execution"/>
    <ProductionExecutionFilters
      v-model:operation="operation"
      v-model:workstation="workstation"
      v-model:showJobsAwaitingInput="showJobsAwaitingInput"
    />
    <UnassignedProductionJobsCallout
      :operation="operation"
      :count="unassignedProductionJobs.length"
      @trigger="showAssignProductionJob = true"
      v-if="unassignedProductionJobs.length"
    />
    <ProductionJobsList
      :data="currentProductionJobs"
      @action="onProductionJobsListAction"
      v-if="operation.type === 'JOB'"
    />
    <ProductionBatchesList
      :data="currentProductionBatches"
      v-if="operation.type === 'BATCH'"
    />
  </CfAppView>

  <AssignProductionJob
    :operation="operation"
    :production-jobs="unassignedProductionJobs"
    :production-batches="productionBatches"
    @success="onUpdateProductionJobSuccess"
    @cancel="showAssignProductionJob = false"
    v-if="showAssignProductionJob"
  />

  <UpdateProductionJob
    :data="productionJob"
    @success="onUpdateProductionJobSuccess"
    @cancel="currentAction = null"
    v-if="currentAction === 'EDIT'"
  />

  <AddProductionRecord
    :production-job="productionJob"
    @success="onAddProductionRecordSuccess"
    @cancel="currentAction = null"
    v-if="currentAction === 'ADD_RECORD'"
  />

  <AddShortfallProductionRecord
    :production-job="productionJob"
    @success="onAddProductionRecordSuccess"
    @cancel="currentAction = null"
    v-if="currentAction === 'CLOSE'"
  />
</template>