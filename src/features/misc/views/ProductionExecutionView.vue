<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductionExecution } from '../composables/productionExecution.js'
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

const router = useRouter()

const {
  operation,
  workstation,
  showAllProductionJobs,
  unassignedProductionJobs,
  productionJobs,
  productionBatches,
  ...productionExecution
} = useProductionExecution()

onMounted(async () => {
  const [jobs, batches] = await Promise.all([
    getProductionJobs(),
    getNotClosedProductionBatches()
  ])

  productionExecution.initialize({ jobs, batches })
})

const showAssignProductionJob = ref(false)
const productionJobAction = ref(null)
const productionJob = ref(null)
const productionBatchAction = ref(null)
const productionBatch = ref(null)

const onProductionJobAction = ({ action, item }) => {
  productionJobAction.value = action
  productionJob.value = item
}

const onProductionBatchAction = ({ action, item }) => {
  if (action === 'ADD_REPORT') {
    router.push({
      name: 'AddProductionBatchReport',
      params: {
        operationName: operation.value.name.toLowerCase().replaceAll(' ', '-'),
        productionBatchId: item.id
      }
    })
  }

  productionBatchAction.value = action
  productionBatch.value = item
}
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Execution"/>
    <ProductionExecutionFilters
      v-model:operation="operation"
      v-model:workstation="workstation"
      v-model:showAll="showAllProductionJobs"
    />
    <UnassignedProductionJobsCallout
      :operation="operation"
      :count="unassignedProductionJobs.length"
      @trigger="showAssignProductionJob = true"
      v-if="unassignedProductionJobs.length"
    />
    <ProductionJobsList
      :data="productionJobs"
      @action="onProductionJobAction"
      v-if="operation.type === 'JOB'"
    />
    <ProductionBatchesList
      :data="productionBatches"
      @action="onProductionBatchAction"
      v-if="operation.type === 'BATCH'"
    />
  </CfAppView>

  <AssignProductionJob
    :operation="operation"
    :production-jobs="unassignedProductionJobs"
    :production-batches="productionBatches"
    @success="productionExecution.updateProductionJob"
    @cancel="showAssignProductionJob = false"
    v-if="showAssignProductionJob"
  />

  <UpdateProductionJob
    :data="productionJob"
    @success="productionExecution.updateProductionJob"
    @cancel="productionJobAction = null"
    v-if="productionJobAction === 'EDIT'"
  />

  <AddProductionRecord
    :production-job="productionJob"
    @success="productionExecution.addProductionRecord"
    @cancel="productionJobAction = null"
    v-if="productionJobAction === 'ADD_RECORD'"
  />

  <AddShortfallProductionRecord
    :production-job="productionJob"
    @success="productionExecution.addProductionRecord"
    @cancel="productionJobAction = null"
    v-if="productionJobAction === 'CLOSE'"
  />
</template>