<script setup>
import { ref } from 'vue'
import { deleteSalesOrderItem } from '../api/index.js'
import { CfDialog, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)

const invoke = async () => {
  try {
    isLoading.value = true

    await deleteSalesOrderItem(props.data.id)

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
  <CfDialog title="Remove sales order item" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to remove <b>{{ props.data.product.normalizedName }}</b> from this order?</p>
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