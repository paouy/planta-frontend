<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfFilledButton, CfInput } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ salesOrderItem: Object })

const isLoading = ref(false)
const product = ref({
  qtyAvailable: null,
  uom: ''
})
const qty = ref(props.salesOrderItem.qtyAllocated)

const ctx = computed(() => ({
  salesOrderItem: {
    id: props.salesOrderItem.id
  },
  qty: qty.value - props.salesOrderItem.qtyAllocated
}))
const maxQty = computed(() => {
  return props.salesOrderItem.qty - props.salesOrderItem.qtyWip
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.allocation.increment(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

api.product
  .getOne(props.salesOrderItem.product.id)
  .then(data => product.value = data)
</script>

<template>
  <CfDialog title="Allocate stock" @close="emit('cancel')">
    <template #body>
      <form id="incrementAllocation" @submit.prevent="invoke">
        <CfInput
          label="Product"
          :value="product.normalizedName"
          disabled
        />
        <CfInput
          v-model.number="qty"
          label="Quantity"
          :suffix="product.uom"
          type="number"
          step="any"
          min="1"
          :max="maxQty"
          :disabled="!product.qtyAvailable"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="incrementAllocation" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#incrementAllocation {
  display: grid;
  gap: 1rem;
}
</style>