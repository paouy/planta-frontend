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
import UnassignedProductionJobsCallout from '../../productionJob/components/UnassignedProductionJobsCallout.vue'

const showAssignProductionJob = ref(false)
const showProductionJobsAwaitingInput = ref(true)
const productionJobs = ref([])
const productionBatches = ref([])
const operation = ref({
  id: '',
  name: '',
  type: ''
})
const workstationId = ref(null)

const unassignedProductionJobs = computed(() => {
  return productionJobs.value
    .filter((job, index) => {
        if (showProductionJobsAwaitingInput.value || index === 0) {
          return true
        } else {
          const { status, productionOrder } = productionJobs.value[index - 1]

          return status !== 'OPEN' && job.productionOrder.id === productionOrder.id
        }
      })
    .filter(job =>
      !job.workstation &&
      !job.productionBatchId &&
      job.operation.id === operation.value.id
    )
})

const currentProductionJobs = computed(() => {
  return productionJobs.value
    .filter((job, index) => {
      if (showProductionJobsAwaitingInput.value || index === 0) {
        return true
      } else {
        const { status, productionOrder } = productionJobs.value[index - 1]

        return status !== 'OPEN' && job.productionOrder.id === productionOrder.id
      }
    })
    .filter(job => job.operation.id === operation.value.id && !!job.workstation)
    .filter(job => workstationId.value ? job.workstation?.id === workstationId.value : true)
})

const currentProductionBatches = computed(() => {
  return productionBatches.value
    .filter(batch => batch.operation.id === operation.value.id)
    .filter(batch => workstationId.value ? batch.workstationId === workstationId.value : true)
})

const onAssignProductionJobSuccess = (productionJob) => {
  const productionJobIndex = productionJobs.value.findIndex(({ id }) => id === productionJob.id)

  Object.assign(productionJobs.value[productionJobIndex], productionJob)
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
      @view="showAssignProductionJob = true"
      v-if="unassignedProductionJobs.length"
    />
    <AssignProductionJob
      :operation="operation"
      :production-jobs="unassignedProductionJobs"
      :production-batches="productionBatches"
      @success="onAssignProductionJobSuccess"
      @cancel="showAssignProductionJob = false"
      v-if="showAssignProductionJob"
    />
    <ProductionJobsList
      :data="currentProductionJobs"
      v-if="operation.type === 'JOB'"
    />
    <ProductionBatchesList
      :data="currentProductionBatches"
      v-else
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