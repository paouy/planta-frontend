<script setup>
import { ref, computed, onMounted } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from 'vue-cf-ui'
import CategorySelect from '../../category/components/CategorySelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({
  product: Object,
  salesOrderItem: Object
})

const isLoading = ref(false)
const categoryId = ref(null)
const products = ref([])
const lastPublicId = ref('')
const ctx = ref({
  publicId: '',
  product: {},
  qty: 1,
  dueDate: null
})

const productOptions = computed(() => {
  const filteredProducts = products.value
    .filter(({ category }) => categoryId.value === category.id)

  const options = filteredProducts
    .map(product => ({ label: product.normalizedName, value: product }))

  return options
})
const maxQty = computed(() => {
  return props.salesOrderItem
    ? props.salesOrderItem.qty - props.salesOrderItem.qtyWip - props.salesOrderItem.qtyAllocated - props.salesOrderItem.qtyFulfilled
    : null
})

const invoke = async () => {
  try {
    isLoading.value = true

    const productionOrder = await api.productionOrder.createOne(ctx.value)

    emit('success', productionOrder)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!props.product && !props.salesOrderItem) {
    api.product.getAll().then(data => products.value = data)
  }

  if (props.product) {
    ctx.value.product = props.product
  }

  if (props.salesOrderItem) {
    ctx.value.publicId = props.salesOrderItem.publicId

    if (props.salesOrderItem.productionOrderCount) {
      ctx.value.publicId += ` (${props.salesOrderItem.productionOrderCount + 1})`
    }

    ctx.value.product = props.salesOrderItem.product
    ctx.value.salesOrderItemId = props.salesOrderItem.id
  }


  api.lookup
    .get('lastProductionOrderPublicId')
    .then(data => lastPublicId.value = data.lastProductionOrderPublicId)
})
</script>

<template>
  <CfDialog title="Create production order" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createProductionOrder" @submit.prevent="invoke">
        <CfInput
          v-model.trim="ctx.publicId"
          label="ID"
          :helper="`Last ID: ${lastPublicId || 'None'}`"
          required
          v-if="!props.salesOrderItem"
        />
        <CategorySelect
          v-model="categoryId"
          type="products"
          :keys="['id']"
          v-if="!props.product && !props.salesOrderItem"
        />
        <CfSelect
          v-model="ctx.product"
          label="Product"
          :options="productOptions"
          required
          v-if="!props.product && !props.salesOrderItem"
        />
        <CfInput
          label="Product"
          :value="ctx.product.normalizedName"
          disabled
          v-else
        />
        <CfInput
          v-model="ctx.qty"
          label="Quantity"
          type="number"
          step="any"
          :min="maxQty ? 1 : 0"
          :max="maxQty"
          :suffix="ctx.product?.uom"
          required
        />
        <CfInput
          v-model="ctx.dueDate"
          label="Due date"
          type="date"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createProductionOrder" :loading="isLoading">
        Create
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createProductionOrder {
  display: grid;
  gap: 1rem;
}
</style>