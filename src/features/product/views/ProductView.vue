<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProduct } from '../api/index.js'
import {
  CfAppView,
  CfAppViewHeader,
  CfBreadcrumbs,
  CfOutlinedButton,
  CfHeader,
  CfSummaryList
} from '../../../components/index.js'
import UpdateProduct from '../components/UpdateProduct.vue'

const breadcrumbs = [{ name: 'Products', path: '/inventory/products' }]

const props = defineProps({ productId: String })

const showUpdateProduct = ref(false)
const product = ref({
  id: '',
  name: '',
  sku: '',
  uom: '',
  collectionId: '',
  collectionName: ''
})

const productSummary = computed(() => {
  return [
    {
      label: 'Collection',
      value: product.value.collectionName
    }, {
      label: 'SKU',
      value: product.value.sku
    }, {
      label: 'Measurement Unit',
      value: product.value.uom
    }, {
      label: 'Operations',
      value: product.value.operations.map(({name}) => name).join(', ')
    }
  ]
})

onMounted(async () => product.value = await getProduct(props.productId))
</script>

<template>
  <CfAppView v-if="product.id">
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="product.name">
      <template #actions>
        <CfOutlinedButton @click="showUpdateProduct = true">
          Edit product
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <CfHeader>Product Details</CfHeader>
    <CfSummaryList :data="productSummary"/>
    <UpdateProduct
      :data="product"
      @success="updatedProduct => product = updatedProduct"
      @cancel="showUpdateProduct = false"
      v-if="showUpdateProduct"
    />
  </CfAppView>
</template>