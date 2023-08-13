<script setup>
import { ref } from 'vue'
import { CfDialog, CfFilledButton } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)

const invoke = async () => {
  try {
    isLoading.value = true

    await api.salesOrder.archive(props.data.id)

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
  <CfDialog title="Archive sales order" @close="emit('cancel')">
    <template #body>
      <p>You're about to archive <b>{{ props.data.publicId }} ({{ props.data.customer.shortName }})</b>. Do you want to proceed?</p>
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