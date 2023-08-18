<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader } from 'vue-cf-ui'
import { AssignJob, UnassignedJobsCallout } from '../features/job/index.js'
import { useProductionExecution, ProductionExecutionFilters, ProductionExecutionList } from '../features/misc/index.js'
import { useOperationStore } from '../features/operation/index.js'
import { CreateOperationBatch, DeleteOperationBatch, OperationBatchesList, StartOperationBatch } from '../features/operationBatch/index.js'
import { CreateProductionRecord, CreateShortfallProductionRecord } from '../features/productionRecord/index.js'
import api from '../api/index.js'

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
const action = ref({ job: null, operationBatch: null })
const job = ref(null)
const operationBatch = ref(null)

const toSlug = (string) => string.toLowerCase().replaceAll(' ', '-')

const onJobAction = ({ key, data }) => {
  action.value.job = key
  job.value = data
}

const onOperationBatchAction = ({ key, data }) => {
  action.value.operationBatch = key
  operationBatch.value = data

  if (key === 'ADD_REPORT') {
    router.push({
      name: 'CreateOperationBatchReport',
      params: {
        operationSlug: toSlug(operation.value.name),
        operationBatchId: data.id
      }
    })
  }
}

watch(operation, ({ name }) => router.push(`/production/execution/${toSlug(name)}`))

onMounted(async () => {
  if (props.operationSlug) {
    const { operations } = useOperationStore()

    const { id, name, isBatch, hasEquipment } = Boolean(props.operationSlug)
      ? operations.value.find(({ name }) => props.operationSlug === toSlug(name))
      : operations.value[0]

    operation.value = { id, name, isBatch, hasEquipment }

    const [jobs, operationBatches] = await Promise.all([
      api.job.getAll(),
      api.operationBatch.getAllNotClosed()
    ])

    productionExecution.initialize(jobs, operationBatches)
  }
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

  <CreateProductionRecord
    :job="job"
    :require-equipment="operation.hasEquipment"
    @success="productionExecution.createProductionRecord"
    @cancel="action.job = job = null"
    v-if="action.job === 'ADD_RECORD'"
  />

  <CreateShortfallProductionRecord
    :job="job"
    @success="productionExecution.createProductionRecord"
    @cancel="action.job = job = null"
    v-if="action.job === 'CLOSE'"
  />

  <CreateOperationBatch
    :operation="operation"
    @success="productionExecution.createOperationBatch"
    @cancel="action.operationBatch = null"
    v-if="action.operationBatch === 'CREATE'"
  />

  <StartOperationBatch
    :data="operationBatch"
    :operation="operation"
    @success="productionExecution.startOperationBatch"
    @cancel="action.operationBatch = operationBatch = null"
    v-if="action.operationBatch === 'START'"
  />

  <DeleteOperationBatch
    :data="operationBatch"
    :operation="operation"
    @success="productionExecution.deleteOperationBatch"
    @cancel="action.operationBatch = operationBatch = null"
    v-if="action.operationBatch === 'REMOVE'"
  />
</template>