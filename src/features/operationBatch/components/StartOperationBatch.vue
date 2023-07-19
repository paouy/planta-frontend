<script setup>
import { ref, computed } from 'vue'
import { startOperationBatch } from '../api/index.js'
import { CfDialog, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const dialogTitle = computed(() => `Start ${props.data.operation.name.toLowerCase()} batch`)
const normalizedJobCount = computed(() => `${props.data.jobCount} job${props.data.jobCount > 1 ? 's' : ''}`)

const onClick = async () => {
  try {
    isLoading.value = true

    await startOperationBatch(props.data.id)

    emit('success', { id: props.data.id })
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
      <p>You are about to start <b>{{ props.data.friendlyId }} — {{ props.data.schedule }}</b> with {{ normalizedJobCount }}. Do you want to proceed?</p>
    </template>
    <template #footer>
      <CfFilledButton
        :loading="isLoading"
        @click="onClick"
      >Proceed</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
    </template>
  </CfDialog>
</template>