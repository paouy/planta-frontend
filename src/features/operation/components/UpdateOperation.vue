<script setup>
import { ref, onMounted } from 'vue'
import { CfDialog, CfInput, CfSwitch, CfFilledButton } from '../../../components/index.js'
import { updateOperation } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const operation = ref({
  id: '',
  name: '',
  seq: null,
  timePerCycleMins: null,
  allowsRework: true,
  isBatch: false,
  batchSizeParameter: null
})

onMounted(() => Object.assign(operation.value, props.data))

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
        <CfInput
          v-model="operation.name"
          label="Name"
          required
        />
        <CfInput
          v-model.number="operation.timePerCycleMins"
          label="Cycle time"
          type="number"
          suffix="mins"
          step="any"
          required
        />
        <CfSwitch
          v-model="operation.allowsRework"
          label="Allow rework"
        />
        <CfSwitch
          v-model="operation.isBatch"
          label="Run by batch"
        />
        <CfInput
          v-model="operation.batchSizeParameter"
          label="Batch size parameter"
          required
          v-if="operation.isBatch"
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