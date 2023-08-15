<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object, operation: Object })

const isLoading = ref(false)

const dialogTitle = computed(() => `Start ${props.operation.name.toLowerCase()} batch`)
const normalizedJobCount = computed(() => `${props.data.jobCount} job${props.data.jobCount > 1 ? 's' : ''}`)

const invoke = async () => {
  try {
    isLoading.value = true

    await api.operationBatch.start(props.data.id)

    emit('success', props.data.id)
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
      <p>You are about to start <b>{{ props.data.publicId }} — {{ props.data.schedule }}</b> with {{ normalizedJobCount }}. Do you want to proceed?</p>
    </template>
    <template #footer>
      <CfFilledButton :loading="isLoading" @click="invoke">
        Proceed
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>