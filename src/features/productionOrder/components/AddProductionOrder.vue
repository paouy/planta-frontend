<script setup>
import { ref, computed, onMounted } from 'vue'
import { addProductionOrder } from '../api/index.js'
import { getProducts } from '../../product/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import CollectionSelect from '../../collection/components/CollectionSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ product: Object })

const isLoading = ref(false)
const collection = ref({ id: '' })
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
    .filter(product => product.collection.id === collection.value.id)
    .map(product => ({ label: `[${product.sku}] ${product.name}`, value: product }))
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
    products.value = await getProducts()
  } else {
    product.value = props.product
  }
})
</script>

<template>
  <CfDialog
    title="Add production order"
    @close="emit('cancel')"
    v-if="!props.product ? products.length : true"
  >
    <template #body>
      <form id="addProductionOrder" @submit.prevent="onSubmit">
        <CollectionSelect
          v-model="collection"
          type="products"
          v-if="!props.product"
        />
        <CfField
          v-model="product"
          label="Product"
          type="select"
          :options="productOptions"
          required
          v-if="!props.product"
        />
        <CfField
          :value="`[${product.sku}] ${product.name}`"
          label="Product"
          type="text"
          disabled
          v-else
        />
        <CfField
          v-model="productionOrder.qty"
          label="Quantity"
          type="number"
          step="any"
          :suffix="product.uom"
          required
        />
        <CfField
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
      >Save</CfFilledButton>
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