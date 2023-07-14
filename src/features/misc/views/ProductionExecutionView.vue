<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProductionJobs } from '../../productionJob/api/index.js'
import { getNotClosedProductionBatches } from '../../productionBatch/api/index.js'
import { CfAppView, CfAppViewHeader, CfSwitch } from '../../../components/index.js'
import OperationSelect from '../../operation/components/OperationSelect.vue'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'
import ProductionBatchesList from '../../productionBatch/components/ProductionBatchesList.vue'
import ProductionJobsList from '../../productionJob/components/ProductionJobsList.vue'
import AssignProductionJob from '../../productionJob/components/AssignProductionJob.vue'
import UpdateProductionJob from '../../productionJob/components/UpdateProductionJob.vue'
import UnassignedProductionJobsCallout from '../../productionJob/components/UnassignedProductionJobsCallout.vue'
import AddProductionRecord from '../../productionRecord/components/AddProductionRecord.vue'
import AddShortfallProductionRecord from '../../productionRecord/components/AddShortfallProductionRecord.vue'

const showProductionJobsAwaitingInput = ref(false)
const showAssignProductionJob = ref(false)
const productionJobs = ref([])
const productionBatches = ref([])
const operation = ref({
  id: '',
  name: '',
  type: ''
})
const workstationId = ref(null)
const productionJob = ref(null)
const currentAction = ref(null)

const productionJobsAwaitingInputFilter = (job, index) => {
  if (showProductionJobsAwaitingInput.value || job.index === 0) {
    return true
  } else {
    const { status, productionOrder } = productionJobs.value[index - 1]

    return status !== 'OPEN' && job.productionOrder.id === productionOrder.id
  }
}

const unassignedProductionJobs = computed(() => {
  return productionJobs.value
    .filter((job, index) => productionJobsAwaitingInputFilter(job, index))
    .filter(job =>
      !job.workstation &&
      !job.productionBatchId &&
      job.operation.id === operation.value.id
    )
})

const currentProductionJobs = computed(() => {
  return productionJobs.value
    .filter((job, index) => productionJobsAwaitingInputFilter(job, index))
    .filter(job => job.operation.id === operation.value.id && !!job.workstation)
    .filter(job => workstationId.value ? job.workstation?.id === workstationId.value : true)
})

const currentProductionBatches = computed(() => {
  return productionBatches.value
    .filter(batch => batch.operation.id === operation.value.id)
    .filter(batch => workstationId.value ? batch.workstationId === workstationId.value : true)
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

  for (let index = 0; index < productionJobs.value.length; index++) {
    if (index > 0) {
      const previousProductionJob = productionJobs.value[index - 1]
      const currentProductionJob = productionJobs.value[index]

      if (previousProductionJob.productionOrder.id === currentProductionJob.productionOrder.id) {
        productionJobs.value[index].qtyExpected = previousProductionJob.qtyExpected + previousProductionJob.operation.summary.shortfall
      } else {
        break
      }
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

    <div class="productionScheduleFilters">
      <OperationSelect
        v-model="operation"
        :keys="['id', 'name', 'type']"
        default-option
        @input="workstationId = null"
      />
      <WorkstationSelect
        v-model="workstationId"
        :keys="['id']"
        :operation-id="operation.id"
        :disabled="!operation.id"
        :required="false"
      />
      <CfSwitch
        v-model="showProductionJobsAwaitingInput"
        label="Show jobs awaiting input"
      />
    </div>

    <UnassignedProductionJobsCallout
      :operation="operation"
      :count="unassignedProductionJobs.length"
      @trigger="showAssignProductionJob = true"
      v-if="unassignedProductionJobs.length"
    />
    <AssignProductionJob
      :operation="operation"
      :production-jobs="unassignedProductionJobs"
      :production-batches="productionBatches"
      @success="onUpdateProductionJobSuccess"
      @cancel="showAssignProductionJob = false"
      v-if="showAssignProductionJob"
    />

    <ProductionJobsList
      :data="currentProductionJobs"
      @action="onProductionJobsListAction"
      v-if="operation.type === 'JOB'"
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

    <ProductionBatchesList
      :data="currentProductionBatches"
      v-if="operation.type === 'BATCH'"
    />
  </CfAppView>
</template>

<style lang="scss">
.productionScheduleFilters {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;

  > :not(:last-child) {
    max-width: 12rem;
  }
}
</style>