<script setup>
import { ref } from 'vue'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import { addOperation } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const operationTypeOptions = [
  { label: 'Job', value: 'JOB' },
  { label: 'Batch', value: 'BATCH' }
]

const isLoading = ref(false)
const operation = ref({
  name: '',
  position: null,
  type: '',
  cycleTimeMins: null,
  batchSizeParameter: null
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedOperation = await addOperation(operation.value)

    emit('success', addedOperation)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add operation" @close="emit('cancel')">
    <template #body>
      <form id="addOperation" @submit.prevent="onSubmit">
        <CfField
          v-model="operation.name"
          label="Name"
          type="text"
          required
        />
        <CfField
          v-model.number="operation.position"
          label="Position"
          type="number"
          required
        />
        <CfField
          v-model.number="operation.cycleTimeMins"
          label="Cycle time"
          type="number"
          suffix="mins"
          step="any"
          required
        />
        <CfField
          v-model="operation.type"
          label="Type"
          type="select"
          :options="operationTypeOptions"
          required
        />
        <CfField
          v-model="operation.batchSizeParameter"
          label="Batch size parameter"
          type="text"
          required
          v-if="operation.type === 'BATCH'"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addOperation"
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
#addOperation {
  display: grid;
  gap: 1rem;
}
</style>