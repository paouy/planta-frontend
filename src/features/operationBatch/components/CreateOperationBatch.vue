<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ operation: Object })

const isLoading = ref(false)
const ctx = ref({
  publicId: '',
  operationId: props.operation.id,
  workstation: null,
  schedule: null
})

const dialogTitle = computed(() => `Add ${props.operation.name.toLowerCase()} batch`)

const invoke = async () => {
  try {
    isLoading.value = true

    const operationBatch = await api.operationBatch.createOne(ctx.value)

    emit('success', operationBatch)
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
      <form id="createOperationBatch" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.publicId"
          label="ID"
          required
        />
        <WorkstationSelect
          v-model="ctx.workstation"
          :operation-id="props.operation.id"
          required
        />
        <CfInput
          v-model="ctx.schedule"
          label="Schedule"
          type="date"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createOperationBatch" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style lang="scss">
#createOperationBatch {
  display: grid;
  gap: 1rem;
}
</style>