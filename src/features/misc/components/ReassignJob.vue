<script setup>
import { ref, computed } from 'vue'
import { replaceProductionOrderWorkstation } from '../../productionOrder/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const reassignment = ref({
  productionOrderId: props.data.productionOrder.id,
  operationId: props.data.operation.id,
  workstation: props.data.workstation
})

const dialogTitle = computed(() => {
  const normalizedOperation = props.data.operation.name.toLowerCase()

  return `Reassign ${normalizedOperation} job to a workstation`
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await replaceProductionOrderWorkstation(
      props.data.productionOrder.id,
      props.data.workstation.id,
      reassignment.value.workstation.id
    )

    emit('success', reassignment.value)
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
      <form id="reassignProductionJobs" @submit.prevent="onSubmit">
        <CfField
          label="Job"
          :value="`${data.productionOrder.friendlyId} — ${data.productName}`"
          type="text"
          disabled
        />
        <WorkstationSelect
          v-model="reassignment.workstation"
          :operation-id="props.data.operation.id"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="reassignProductionJobs"
        :loading="isLoading"
        :disabled="props.data.workstation.id === reassignment.workstation.id"
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
#reassignProductionJobs {
  display: grid;
  gap: 1rem;
}
</style>