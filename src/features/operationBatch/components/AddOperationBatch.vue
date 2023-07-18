<script setup>
import { ref, computed } from 'vue'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'
import EquipmentSelect from '../../equipment/components/EquipmentSelect.vue'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import { addOperationBatch } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ operation: Object })

const isLoading = ref(false)
const operationBatch = ref({
  customerFriendlyId: null,
  operation: props.operation,
  workstation: null,
  equipmentId: null,
  schedule: null
})

const dialogTitle = computed(() => `Add ${props.operation.name.toLowerCase()} record`)

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedOperationBatch = await addOperationBatch(operationBatch.value)

    emit('success', addedOperationBatch)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog :title="dialogTitle" @close="emit('cancel')">
    <template #body>
      <form id="addOperationBatch" @submit.prevent="onSubmit">
        <WorkstationSelect
          v-model="operationBatch.workstation"
          :operation-id="props.operation.id"
          required
        />
        <EquipmentSelect
          v-model="operationBatch.equipmentId"
          :operation-id="props.operation.id"
          :keys="['id']"
          required
        />
        <CfField
          v-model="operationBatch.schedule"
          label="Schedule"
          type="date"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addOperationBatch"
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
#addOperationBatch {
  display: grid;
  gap: 1rem;
}
</style>