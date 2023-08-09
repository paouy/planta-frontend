<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toSlug } from '../../../helpers/index.js'
import { useProductionExecution } from '../composables/productionExecution.js'
import { useOperationStore } from '../../operation/store.js'
import { CfAppView, CfAppViewHeader } from '../../../components/index.js'
import ProductionExecutionFilters from '../components/ProductionExecutionFilters.vue'
import ProductionExecutionList from '../components/ProductionExecutionList.vue'
import UnassignedJobsCallout from '../../job/components/UnassignedJobsCallout.vue'
import AssignJob from '../../job/components/AssignJob.vue'
import AddProductionRecord from '../../productionRecord/components/AddProductionRecord.vue'
import AddShortfallProductionRecord from '../../productionRecord/components/AddShortfallProductionRecord.vue'
import OperationBatchesList from '../../operationBatch/components/OperationBatchesList.vue'
import AddOperationBatch from '../../operationBatch/components/AddOperationBatch.vue'
import StartOperationBatch from '../../operationBatch/components/StartOperationBatch.vue'
import RemoveOperationBatch from '../../operationBatch/components/RemoveOperationBatch.vue'
import api from '../../../api/index.js'

const router = useRouter()
const props = defineProps({ operationSlug: String })

const {
  operation,
  workstation,
  showAllJobs,
  unassignedJobs,
  currentJobs,
  currentOperationBatches,
  ...productionExecution
} = useProductionExecution()

const listType = ref('BATCH')
const action = ref({})
const job = ref(null)
const operationBatch = ref(null)

const onJobAction = ({ key, data }) => {
  action.value.job = key
  job.value = data
}

const onOperationBatchAction = ({ key, data }) => {
  action.value.operationBatch = key
  operationBatch.value = data

  if (key === 'ADD_REPORT') {
    router.push({
      name: 'AddOperationBatchReport',
      params: {
        operationSlug: toSlug(operation.value.name),
        operationBatchId: data.id
      }
    })
  }
}

watch(operation, ({ name }) => router.push(`/production/execution/${toSlug(name)}`))

onMounted(async () => {
  const { operations } = useOperationStore()

  const { id, name, isBatch } = Boolean(props.operationSlug)
    ? operations.value.find(({ name }) => props.operationSlug === toSlug(name))
    : operations.value[0]

  operation.value = { id, name, isBatch }

  const [jobs, operationBatches] = await Promise.all([
    api.job.getAll(),
    api.operationBatch.getAllNotClosed()
  ])

  productionExecution.initialize(jobs, operationBatches)
})
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Execution"/>
    <ProductionExecutionFilters
      v-model:operation="operation"
      v-model:workstation="workstation"
      v-model:show="showAllJobs"
      v-model:list="listType"
    />
    <UnassignedJobsCallout
      :operation="operation"
      :count="unassignedJobs.length"
      @trigger="action.job = 'ASSIGN'"
      v-if="unassignedJobs.length"
    />
    <ProductionExecutionList
      :data="currentJobs"
      @action="onJobAction"
      v-if="!operation.isBatch || listType === 'JOB'"
    />
    <OperationBatchesList
      :data="currentOperationBatches"
      @action="onOperationBatchAction"
      v-else
    />
  </CfAppView>

  <AssignJob
    :operation="operation"
    :job="job"
    :unassigned-jobs="unassignedJobs"
    :operation-batches="currentOperationBatches"
    @success="productionExecution.updateJob"
    @cancel="action.job = job = null"
    v-if="action.job === 'ASSIGN' || action.job === 'REASSIGN'"
  />

  <AddProductionRecord
    :job="job"
    @success="productionExecution.createProductionRecord"
    @cancel="action.job = job = null"
    v-if="action.job === 'ADD_RECORD'"
  />

  <AddShortfallProductionRecord
    :job="job"
    @success="productionExecution.createProductionRecord"
    @cancel="action.job = job = null"
    v-if="action.job === 'CLOSE'"
  />

  <AddOperationBatch
    :operation="operation"
    @success="productionExecution.createOperationBatch"
    @cancel="action.operationBatch = null"
    v-if="action.operationBatch === 'CREATE'"
  />

  <StartOperationBatch
    :data="operationBatch"
    @success="productionExecution.startOperationBatch"
    @cancel="action.operationBatch = operationBatch = null"
    v-if="action.operationBatch === 'START'"
  />

  <RemoveOperationBatch
    :data="operationBatch"
    @success="productionExecution.deleteOperationBatch"
    @cancel="action.operationBatch = operationBatch = null"
    v-if="action.operationBatch === 'REMOVE'"
  />
</template>