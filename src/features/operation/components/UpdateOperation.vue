<script setup>
import { ref, onMounted } from 'vue'
import { CfDialog, CfInput, CfSwitch, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: '',
  name: '',
  seq: null,
  timePerCycleMins: null,
  allowsRework: true,
  isBatch: false,
  batchSizeParameter: null
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.operation.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => Object.assign(ctx.value, props.data))
</script>

<template>
  <CfDialog title="Edit operation" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="updateOperation" @submit.prevent="invoke">
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
      <CfFilledButton type="submit" form="updateOperation" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateOperation {
  display: grid;
  gap: 1rem;
}
</style>