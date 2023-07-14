<script setup>
import { ref, computed } from 'vue'
import { updateProductionJob } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({
  operation: Object,
  productionJobs: {
    type: Array,
    default: () => []
  },
  productionBatches: {
    type: Array,
    default: () => []
  }
})

const isLoading = ref(false)
const productionJobId = ref('')
const productionJobData = ref({
  workstation: null,
  productionBatchId: null
})

const productionJobOptions = computed(() => {
  return props.productionJobs.map(job => ({
    label: `${job.productionOrder.friendlyId} — ${job.product.name}`,
    value: job.id
  }))
})

const productionBatchesOptions = computed(() => {
  return props.productionBatches.map(batch => ({
    label: `${batch.friendlyId} — ${batch.schedule}`,
    value: { workstation: batch.workstation, productionBatchId: batch.id }
  }))
})

const dialogTitle = computed(() => {
  const assignment = props.operation.type === 'JOB' ? 'workstation' : 'batch'
  const normalizedOperation = props.operation.name.toLowerCase()

  return `Assign ${normalizedOperation} job to a ${assignment}`
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const productionJob = {
      id: productionJobId.value,
      ...productionJobData.value
    }

    await updateProductionJob(productionJob)

    await emit('success', productionJob)

    productionJobId.value = ''
    productionJobData.value = {
      workstation: null,
      productionBatchId: null
    }

    if (!props.productionJobs.length) {
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
          v-model="productionJobId"
          label="Job"
          type="select"
          :options="productionJobOptions"
          required
        />
        <WorkstationSelect
          v-model="productionJobData.workstation"
          :operation-id="operation.id"
          required
          v-if="props.operation.type === 'JOB'"
        />
        <CfField
          v-model="productionJobData"
          label="Batch"
          type="select"
          :options="productionBatchesOptions"
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