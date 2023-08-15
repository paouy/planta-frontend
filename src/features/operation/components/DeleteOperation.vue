<script setup>
import { ref } from 'vue'
import { CfDialog, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)

const invoke = async () => {
  try {
    isLoading.value = true

    await api.operation.deleteOne(props.data.id)

    emit('success', props.data.index)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Remove operation" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to remove <b>{{ props.data?.name }}</b> as an operation?</p>
    </template>
    <template #footer>
      <CfFilledButton color="red" :loading="isLoading" @click="invoke">
        Remove
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>