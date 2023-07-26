<script setup>
import { ref } from 'vue'
import { removeCustomer } from '../api/index.js'
import { CfDialog, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)

const onClick = async () => {
  try {
    isLoading.value = true

    await removeCustomer(props.data.id)

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
  <CfDialog title="Delete customer" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to delete <b>{{ props.data.name }}</b>?</p>
    </template>
    <template #footer>
      <CfFilledButton color="red" :loading="isLoading" @click="onClick">
        Delete
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>