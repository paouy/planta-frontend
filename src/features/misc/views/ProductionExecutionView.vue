<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toSlug } from '../../../helpers/index.js'
import { useProductionExecution } from '../composables/productionExecution.js'
import { useOperationStore } from '../../operation/store.js'
import { getProductionOrders } from '../../productionOrder/api/index.js'
import { getOperationBatches } from '../../operationBatch/api/index.js'
import { CfAppView, CfAppViewHeader } from '../../../components/index.js'
import ProductionExecutionFilters from '../components/ProductionExecutionFilters.vue'
import UnassignedJobsCallout from '../components/UnassignedJobsCallout.vue'
import JobsList from '../components/JobsList.vue'
import AssignJob from '../components/AssignJob.vue'
import UpdateJob from '../components/UpdateJob.vue'
import AddProductionRecord from '../../productionRecord/components/AddProductionRecord.vue'
import AddShortfallProductionRecord from '../../productionRecord/components/AddShortfallProductionRecord.vue'
import OperationBatchesList from '../../operationBatch/components/OperationBatchesList.vue'
import AddOperationBatch from '../../operationBatch/components/AddOperationBatch.vue'

const router = useRouter()

const {
  operation,
  workstation,
  showAllJobs,
  unassignedJobs,
  jobs,
  operationBatches,
  ...productionExecution
} = useProductionExecution()

const props = defineProps({ operationSlug: String })

const showAssignJob = ref(false)
const jobAction = ref(null)
const job = ref(null)
const operationBatchAction = ref(null)
const operationBatch = ref(null)

const onJobAction = ({ action, item }) => {
  jobAction.value = action
  job.value = item
}

const onOperationBatchAction = ({ action, item }) => {
  if (action === 'ADD_REPORT') {
    router.push({
      name: 'AddOperationBatchReport',
      params: {
        operationSlug: toSlug(operation.value.name),
        operationBatchId: item.id
      }
    })
  }

  operationBatchAction.value = action
  operationBatch.value = item
}

watch(operation, ({ name }) => router.push(`/production/execution/${toSlug(name)}`))

onMounted(async () => {
  const { operations } = useOperationStore()

  const { id, name, isBatch } = !!props.operationSlug
    ? operations.value.find(({ name }) => props.operationSlug === toSlug(name))
    : operations.value[0]

  operation.value = { id, name, isBatch }

  const [orders, batches] = await Promise.all([
    getProductionOrders(),
    getOperationBatches()
  ])

  productionExecution.initialize({ orders, batches })
})
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Execution"/>
    <ProductionExecutionFilters
      v-model:operation="operation"
      v-model:workstation="workstation"
      v-model:showAll="showAllJobs"
    />
    <UnassignedJobsCallout
      :operation="operation"
      :count="unassignedJobs.length"
      @trigger="showAssignJob = true"
      v-if="unassignedJobs.length"
    />
    <JobsList
      :data="jobs"
      @action="onJobAction"
      v-if="!operation.isBatch"
    />
    <OperationBatchesList
      :data="operationBatches"
      @action="onOperationBatchAction"
      v-else
    />
  </CfAppView>

  <AssignJob
    :data="unassignedJobs"
    :operation="operation"
    :operation-batches="operationBatches"
    @success="productionExecution.updateJob"
    @cancel="showAssignJob = false"
    v-if="showAssignJob"
  />

  <UpdateJob
    :data="job"
    @success="productionExecution.updateJob"
    @cancel="jobAction = null"
    v-if="jobAction === 'EDIT'"
  />

  <AddProductionRecord
    :job="job"
    @success="productionExecution.addProductionRecord"
    @cancel="jobAction = null"
    v-if="jobAction === 'ADD_RECORD'"
  />

  <AddShortfallProductionRecord
    :job="job"
    @success="productionExecution.addProductionRecord"
    @cancel="jobAction = null"
    v-if="jobAction === 'CLOSE'"
  />

  <AddOperationBatch
    :operation="operation"
    @success="productionExecution.addOperationBatch"
    @cancel="operationBatchAction = null"
    v-if="operationBatchAction === 'CREATE'"
  />
</template>