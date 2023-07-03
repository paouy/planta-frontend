<script setup>
import { ref } from 'vue'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import { updateOperation } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const operationTypeOptions = [
  { label: 'Job', value: 'JOB' },
  { label: 'Batch', value: 'BATCH' }
]

const isLoading = ref(false)
const operation = ref({
  id: props.data.id,
  name: props.data.name,
  type: props.data.type,
  position: props.data.position,
  uom: props.data.uom
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateOperation(operation.value)

    emit('success', operation.value)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Edit operation" @close="emit('cancel')">
    <template #body>
      <form id="updateOperation" @submit.prevent="onSubmit">
        <CfField
          v-model.number="operation.position"
          type="number"
          label="Position"
          required
        />
        <CfField
          v-model="operation.name"
          type="text"
          label="Name"
          required
        />
        <CfField
          v-model="operation.type"
          type="select"
          label="Type"
          :options="operationTypeOptions"
          required
        />
        <CfField
          v-model="operation.uom"
          label="Batch size unit"
          type="text"
          required
          v-if="operation.type === 'BATCH'"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="updateOperation"
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
#updateOperation {
  display: grid;
  gap: 1rem;
}
</style>