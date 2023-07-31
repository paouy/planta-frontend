<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProducts } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import ProductsList from '../components/ProductsList.vue'
import AddProduct from '../components/AddProduct.vue'
import AddProductionOrder from '../../productionOrder/components/AddProductionOrder.vue'
import IncrementProduct from '../components/IncrementProduct.vue'

const router = useRouter()
const products = ref([])
const product = ref(null)
const showAddProduct = ref(false)
const showAddProductionOrder = ref(false)
const showIncrementProduct = ref(false)

const onProductsListAction = ({ action, data }) => { 
  if (action === 'MAKE') {
    showAddProductionOrder.value = true
  }
  
  if (action === 'ADJUST') {
    showIncrementProduct.value = true
  }

  if (action === 'VIEW') {
    router.push({
      name: 'Product',
      params: { productId: data.id }
    })
  }

  product.value = data
}

const onAddProductSuccess = (addedProduct) => {
  router.push({
    name: 'Product',
    params: { productId: addedProduct.id }
  })
}

const onAddProductionOrderSuccess = (productionOrder) => {
  const productIndex = products.value
    .findIndex(({ id }) => id === productionOrder.product.id)

  products.value[productIndex].qtyExpected += productionOrder.qty
}

const onIncrementProductSucess = (incrementedProduct) => {
  const productIndex = products.value
    .findIndex(({ id }) => id === incrementedProduct.id)

  Object.assign(products.value[productIndex], incrementedProduct)
}

onMounted(async () => products.value = await getProducts())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Inventory" title="Products">
      <template #actions>
        <CfOutlinedButton @click="showAddProduct = true">
          Add product
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <ProductsList
      :data="products"
      @action="onProductsListAction"
    />
    <AddProduct
      @success="onAddProductSuccess"
      @cancel="showAddProduct = false"
      v-if="showAddProduct"
    />
    <AddProductionOrder
      :product="product"
      @success="onAddProductionOrderSuccess"
      @cancel="showAddProductionOrder = false"
      v-if="showAddProductionOrder"
    />
    <IncrementProduct
      :data="product"
      @success="onIncrementProductSucess"
      @cancel="showIncrementProduct = false"
      v-if="showIncrementProduct"
    />
  </CfAppView>
</template>