<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ salesOrderItem: Object })

const isLoading = ref(false)
const ctx = ref({
  salesOrderItemId: props.salesOrderItem.id,
  qty: null
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.fulfillment.createOne(ctx.value)

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
  <CfDialog title="Create fulfillment" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createFulfillment" @submit.prevent="invoke">
        <CfInput
          label="Product"
          :value="props.salesOrderItem.product.normalizedName"
          disabled
        />
        <CfInput
          label="Unfulfilled demand"
          :value="props.salesOrderItem.qty - props.salesOrderItem.qtyFulfilled"
          :suffix="props.salesOrderItem.product.uom"
          disabled
        />
        <CfInput
          v-model.number="ctx.qty"
          label="Quantity"
          type="number"
          step="any"
          min="1"
          :max="props.salesOrderItem.qtyAllocated"
          :suffix="props.salesOrderItem.product.uom"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createFulfillment" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createFulfillment {
  display: grid;
  gap: 1rem;
}
</style>