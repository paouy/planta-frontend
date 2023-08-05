<script setup>
import { ref, computed, onMounted } from 'vue'
import { createSalesOrderItem } from '../api/index.js'
import { getProducts } from '../../product/api/index.js'
import { CfDialog, CfSelect, CfInput, CfFilledButton } from '../../../components/index.js'
import CollectionSelect from '../../collection/components/CollectionSelect.vue'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ salesOrder: Object })

const isLoading = ref(false)
const productOptions = ref([])
const collectionId = ref('')
const ctx = ref({
  salesOrderId: props.salesOrder.id,
  product: {
    id: '',
    normalizedName: '',
    uom: ''
  },
  qty: null
})

const computedProductOptions = computed(() => {
  const productIds = props.salesOrder.items.map(({ product }) => product.id)

  return productOptions.value
    .filter(option => collectionId.value === option.collectionId)
    .map(option => ({ ...option, disabled: productIds.includes(option.value.id) }))
})

const invoke = async () => {
  try {
    isLoading.value = true

    const { id } = await createSalesOrderItem(ctx.value)

    const salesOrderItem = {
      id,
      product: ctx.value.product,
      qty: ctx.value.qty,
      qtyWip: 0,
      qtyAllocated: 0,
      seq: props.salesOrder.items.findLast(() => true).seq + 1
    }

    emit('success', salesOrderItem)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  const products = await getProducts()

  productOptions.value = products.map(({ id, normalizedName, uom, collection }) => ({
    label: normalizedName,
    value: { id, normalizedName, uom },
    collectionId: collection.id
  }))
})
</script>

<template>
  <CfDialog title="Add sales order item" @close="emit('cancel')">
    <template #body>
      <form id="createSalesOrderItem" @submit.prevent="invoke">
        <CollectionSelect
          v-model="collectionId"
          type="products"
          :keys="['id']"
        />
        <CfSelect
          v-model="ctx.product"
          label="Product"
          :options="computedProductOptions"
          required
        />
        <CfInput
          v-model.number="ctx.qty"
          label="Quantity"
          :suffix="ctx.product.uom"
          type="number"
          step="any"
          min="1"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createSalesOrderItem" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createSalesOrderItem {
  display: grid;
  gap: 1rem;
}
</style>