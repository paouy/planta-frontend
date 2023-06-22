<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { addProductionOrder } from '../api/index.js'
import { getCollections } from '../../collection/api/index.js'
import { getProducts } from '../../product/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ product: Object })

const isLoading = ref(false)
const productionOrder = ref({
  qty: 1,
  dueDate: null
})

const collectionOptions = ref([])
const collection = ref({
  id: '',
  name: ''
})
const productOptions = ref([])
const product = ref({
  id: '',
  name: '',
  sku: '',
  uom: ''
})

const computedProductOptions = computed(() => {
  return productOptions.value.filter(
    ({ value }) => value.collectionId === collection.value.id
  )
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

onBeforeMount(async () => {
  if (!props.product) {
    const [collections, products] =
      await Promise.all([getCollections(), getProducts()])

    collectionOptions.value = collections
      .filter(collection => collection.type === 'PRODUCTS')
      .map(collection => ({ label: collection.name, value: collection }))

    productOptions.value = products
      .map(product => ({ label: product.name, value: product }))
  } else {
    product.value = props.product
  }
})
</script>

<template>
  <CfDialog
    title="Add production order"
    @close="emit('cancel')"
    v-if="!props.product ? collectionOptions.length && productOptions.length : true"
  >
    <template #body>
      <form id="addProductionOrder" @submit.prevent="onSubmit">
        <CfField
          v-model="collection"
          label="Collection"
          type="select"
          :options="collectionOptions"
          required
          v-if="!props.product"
        />
        <CfField
          v-model="product"
          label="Name"
          type="select"
          :options="computedProductOptions"
          required
          v-if="!props.product"
        />
        <CfField
          v-model="product.name"
          label="Name"
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