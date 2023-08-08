<script setup>
import { ref, computed, onMounted } from 'vue'
import { addProductionOrder } from '../api/index.js'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from '../../../components/index.js'
import CategorySelect from '../../category/components/CategorySelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({
  product: Object,
  salesOrderItemId: String
})

const isLoading = ref(false)
const category = ref({ id: '' })
const products = ref([])
const product = ref({
  id: '',
  name: '',
  sku: '',
  uom: ''
})

const productionOrder = ref({
  qty: 1,
  dueDate: null
})

const productOptions = computed(() => {
  return products.value
    .filter(product => product.category.id === category.value.id)
    .map(product => ({ label: product.normalizedName, value: product }))
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedProductionOrder = await addProductionOrder({
      ...productionOrder.value,
      productId: product.value.id,
      status: 'OPEN'
    })

    emit('success', addedProductionOrder)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onMounted(async () => {
  if (!props.product) {
    products.value = await api.product.getAll()
  } else {
    product.value = props.product
  }

  if (props.salesOrderItemId) {
    productionOrder.value.salesOrderItemId = props.salesOrderItemId
  }
})
</script>

<template>
  <CfDialog
    title="Create production order"
    @close="emit('cancel')"
    v-if="!props.product ? products.length : true"
  >
    <template #body>
      <form id="addProductionOrder" @submit.prevent="onSubmit">
        <CategorySelect
          v-model="category"
          type="products"
          v-if="!props.product"
        />
        <CfSelect
          v-model="product"
          label="Product"
          :options="productOptions"
          required
          v-if="!props.product"
        />
        <CfInput
          label="Product"
          :value="product.normalizedName"
          disabled
          v-else
        />
        <CfInput
          v-model="productionOrder.qty"
          label="Quantity"
          type="number"
          step="any"
          :suffix="product.uom"
          required
        />
        <CfInput
          v-model="productionOrder.dueDate"
          label="Due date"
          type="date"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addProductionOrder"
        :loading="isLoading"
      >Create</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
    </template>
  </CfDialog>
</template>

<style lang="scss">
#addProductionOrder {
  display: grid;
  gap: 1rem;
}
</style>