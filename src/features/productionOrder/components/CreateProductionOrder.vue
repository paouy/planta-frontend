<script setup>
import { ref, computed, onMounted } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from '../../../components/index.js'
import CategorySelect from '../../category/components/CategorySelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({
  product: Object,
  salesOrderItemId: String
})

const isLoading = ref(false)
const categoryId = ref(null)
const products = ref([])
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
  if (props.product) {
    ctx.value.product = props.product
  } else {
    api.product.getAll().then(data => products.value = data)
  }

  if (props.salesOrderItemId) {
    ctx.value.salesOrderItemId = props.salesOrderItemId
  }
})
</script>

<template>
  <CfDialog title="Create production order" @close="emit('cancel')">
    <template #body>
      <form id="createProductionOrder" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.publicId"
          label="ID"
          required
          v-if="!props.salesOrderItemId"
        />
        <CategorySelect
          v-model="categoryId"
          type="products"
          :keys="['id']"
          v-if="!props.product"
        />
        <CfSelect
          v-model="ctx.product"
          label="Product"
          :options="productOptions"
          required
          v-if="!props.product"
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