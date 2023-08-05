<script setup>
import { ref } from 'vue'
import { updateSalesOrderItem } from '../api/index.js'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  qty: props.data.qty
})

const invoke = async () => {
  try {
    isLoading.value = true

    await updateSalesOrderItem(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Edit sales order item" @close="emit('cancel')">
    <template #body>
      <form id="updateSalesOrderItemQty" @submit.prevent="invoke">
        <CfInput
          label="Product"
          :value="props.data.product.normalizedName"
          disabled
        />
        <CfInput
          v-model.number="ctx.qty"
          label="Quantity"
          type="number"
          step="any"
          min="1"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateSalesOrderItemQty" :loading="isLoading" :disabled="props.data.qty === ctx.qty">
        Edit
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateSalesOrderItemQty {
  display: grid;
  gap: 1rem;
}
</style>