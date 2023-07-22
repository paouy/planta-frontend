<script setup>
import { ref, computed } from 'vue'
import { addProductionOrderWorkstation } from '../../productionOrder/api/index.js'
import { addOperationBatchJob } from '../../operationBatchJob/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  operation: Object,
  operationBatches: {
    type: Array,
    default: () => []
  }
})

const isLoading = ref(false)
const assignment = ref({
  productionOrderId: null,
  operationId: props.operation.id,
  workstation: null,
  batch: null
})

const jobOptions = computed(() => {
  return props.data.map(job => ({
    label: `${job.productionOrder.friendlyId} — ${job.productName}`,
    value: job.productionOrder.id
  }))
})

const operationBatchesOptions = computed(() => {
  return props.operationBatches
    .filter(({ status }) => status === 'OPEN')
    .map(({ id, friendlyId, schedule }) => ({
      label: `${friendlyId} — ${schedule}`,
      value: { id, friendlyId, schedule }
    }))
})

const dialogTitle = computed(() => {
  const assignment = props.operation.isBatch ? 'batch' : 'workstation'
  const normalizedOperation = props.operation.name.toLowerCase()

  return `Assign ${normalizedOperation} job to a ${assignment}`
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    if (props.operation.isBatch) {
      const { workstation } = props.operationBatches
        .find(({ id }) => id === assignment.value.batch.id)

      assignment.value.workstation = workstation

      await addOperationBatchJob(assignment.value)
    }

    await addProductionOrderWorkstation(assignment.value)

    await emit('success', assignment.value)

    assignment.value = {
      productionOrderId: null,
      operationId: props.operation.id,
      workstation: null,
      batch: null
    }

    if (!props.data.length) {
      emit('cancel')
    }
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog :title="dialogTitle" @close="emit('cancel')">
    <template #body>
      <form id="assignProductionJobs" @submit.prevent="onSubmit">
        <CfField
          v-model="assignment.productionOrderId"
          label="Job"
          type="select"
          :options="jobOptions"
          required
        />
        <WorkstationSelect
          v-model="assignment.workstation"
          :operation-id="operation.id"
          required
          v-if="!props.operation.isBatch"
        />
        <CfField
          v-model="assignment.batch"
          label="Batch"
          type="select"
          :options="operationBatchesOptions"
          required
          v-else
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="assignProductionJobs"
        :loading="isLoading"
      >Save</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
    </template>
  </CfDialog>
</template>

<style lang="scss">
#assignProductionJobs {
  display: grid;
  gap: 1rem;
}
</style>