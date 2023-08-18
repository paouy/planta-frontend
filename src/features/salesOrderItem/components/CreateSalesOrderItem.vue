<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfSelect, CfInput, CfFilledButton } from 'vue-cf-ui'
import CategorySelect from '../../category/components/CategorySelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({
  salesOrder: Object,
  salesOrderItems: Array
})

const isLoading = ref(false)
const productOptions = ref([])
const categoryId = ref('')
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
  const productIds = props.salesOrderItems.map(({ product }) => product.id)
  const options = productOptions.value
    .filter(option => categoryId.value === option.categoryId)
    .map(option => ({ ...option, disabled: productIds.includes(option.value.id) }))

  return options
})

const invoke = async () => {
  try {
    isLoading.value = true

    const { id } = await api.salesOrderItem.createOne(ctx.value)

    const salesOrderItem = {
      id,
      product: ctx.value.product,
      qty: ctx.value.qty,
      qtyWip: 0,
      qtyAllocated: 0
    }

    emit('success', salesOrderItem)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

api.product.getAll().then(products => {
  productOptions.value = products.map(({ id, normalizedName, uom, category }) => {
    return {
      label: normalizedName,
      value: { id, normalizedName, uom },
      categoryId: category.id
    }
  })
})
</script>

<template>
  <CfDialog title="Add sales order item" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createSalesOrderItem" @submit.prevent="invoke">
        <CategorySelect
          v-model="categoryId"
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