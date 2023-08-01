<script setup>
import { ref, onMounted } from 'vue'
import { createAllocationOrder } from '../api/index.js'
import { getProduct } from '../../product/api/index.js'
import { CfDialog, CfFilledButton, CfInput } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({
  salesOrderItemId: String,
  product: Object
})

const isLoading = ref(false)

const product = ref({
  qtyAvailable: null,
  uom: ''
})

const allocationOrder = ref({
  salesOrderItem: {
    id: props.salesOrderItemId
  },
  qty: null
})

const invoke = async () => {
  try {
    isLoading.value = true

    const createdAllocationOrder = await createAllocationOrder(allocationOrder.value)

    emit('success', createdAllocationOrder)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => product.value = await getProduct(props.product.id))
</script>

<template>
  <CfDialog title="Create allocation order" @close="emit('cancel')">
    <template #body>
      <form id="createAllocationOrder" @submit.prevent="invoke">
        <CfInput
          label="Product"
          :value="props.product.normalizedName"
          disabled
        />
        <CfInput
          v-model.number="allocationOrder.qty"
          label="Quantity"
          :suffix="product.uom"
          type="number"
          step="any"
          min="1"
          :max="product.qtyAvailable - product.qtyAllocated"
          :disabled="!product.qtyAvailable"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createAllocationOrder" :loading="isLoading">
        Create
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createAllocationOrder {
  display: grid;
  gap: 1rem;
}
</style>