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
const currentAction = ref(null)

const onProductsListAction = ({ key, data }) => { 
  if (key === 'VIEW') {
    router.push({
      name: 'Product',
      params: {
        productId: data.id
      }
    })
  }

  currentAction.value = key
  product.value = data
}

const onAddProduct = ({ id: productId }) => {
  router.push({
    name: 'Product',
    params: { productId }
  })
}

const onAddProductionOrder = (productionOrder) => {
  const product = products.value.find(({ id }) => productionOrder.product.id === id)
  product.qtyWip += productionOrder.qty
}

const onIncrement = (incrementedProduct) => {
  const index = products.value.findIndex(({ id }) => incrementedProduct.id === id)
  Object.assign(products.value[index], incrementedProduct)
}

onMounted(async () => products.value = await getProducts())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Inventory" title="Products">
      <template #actions>
        <CfOutlinedButton @click="currentAction = 'ADD'">
          Add product
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <ProductsList
      :data="products"
      @action="onProductsListAction"
    />
  </CfAppView>

  <AddProduct
    @success="onAddProduct"
    @cancel="currentAction = null"
    v-if="currentAction === 'ADD'"
  />

  <AddProductionOrder
    :product="product"
    @success="onAddProductionOrder"
    @cancel="currentAction = product = null"
    v-if="currentAction === 'MAKE'"
  />

  <IncrementProduct
    :data="product"
    @success="onIncrement"
    @cancel="currentAction = product = null"
    v-if="currentAction === 'ADJUST'"
  />
</template>