<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSwitch, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ lastSeq: Number })

const isLoading = ref(false)
const ctx = ref({
  name: '',
  seq: (props.lastSeq || 0) + 1,
  timePerCycleMins: null,
  allowsRework: true,
  isBatch: false,
  batchSizeParameter: null
})

const invoke = async () => {
  try {
    isLoading.value = true

    const operation = await api.operation.createOne(ctx.value)

    emit('success', operation)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add operation" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createOperation" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
        <CfInput
          v-model.number="ctx.timePerCycleMins"
          label="Cycle time"
          type="number"
          suffix="mins"
          step="any"
          required
        />
        <CfSwitch
          v-model="ctx.allowsRework"
          label="Allow rework"
        />
        <CfSwitch
          v-model="ctx.isBatch"
          label="Run by batch"
        />
        <CfInput
          v-model="ctx.batchSizeParameter"
          label="Batch size parameter"
          required
          v-if="ctx.isBatch"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createOperation" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createOperation {
  display: grid;
  gap: 1rem;
}
</style>