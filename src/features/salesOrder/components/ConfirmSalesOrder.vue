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

    await api.salesOrder.confirm(props.data.id)

    emit('success')
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Confirm sales order" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <p>You're about to confirm <b>{{ props.data.publicId }} ({{ props.data.customer.shortName }})</b>. You won't be able to change any order items. Do you want to proceed?</p>
    </template>
    <template #footer>
      <CfFilledButton :loading="isLoading" @click="invoke">
        Confirm
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>