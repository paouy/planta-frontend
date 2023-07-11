<script setup>
import { ref, computed } from 'vue'
import { updateProductionJob } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const productionJob = ref({
  id: props.data.id,
  workstation: props.data.workstation,
  timeEstimatedMins: props.data.timeEstimatedMins
})

const dialogTitle = computed(() => {
  const normalizedOperation = props.data.operation.name.toLowerCase()

  return `Update ${normalizedOperation} job`
})

const normalizedProductionJob = computed(() => {
  return `${props.data.productionOrder.friendlyId} — ${props.data.product.name}`
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const updatedProductionJob = { ...productionJob.value }

    if (updatedProductionJob.timeEstimatedMins === props.data.timeEstimatedMins) {
      updatedProductionJob.timeEstimatedMins = null
    }

    await updateProductionJob(updatedProductionJob)

    emit('success', productionJob.value)
    emit('cancel')
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
      <form id="updateProductionJob" @submit.prevent="onSubmit">
        <CfField
          v-model="normalizedProductionJob"
          label="Job"
          type="text"
          disabled
        />
        <WorkstationSelect
          v-model="productionJob.workstation"
          :operation-id="props.data.operation.id"
          required
        />
        <CfField
          v-model.number="productionJob.timeEstimatedMins"
          label="Estimated time"
          type="number"
          suffix="mins"
          step="any"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="updateProductionJob"
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
#updateProductionJob {
  display: grid;
  gap: 1rem;
}
</style>