<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import ProductsList from '../components/ProductsList.vue'
import CreateProduct from '../components/CreateProduct.vue'
import AddProductionOrder from '../../productionOrder/components/AddProductionOrder.vue'
import IncrementProduct from '../components/IncrementProduct.vue'
import api from '../../../api/index.js'

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

const onCreateProduct = ({ id: productId }) => {
  router.push({
    name: 'Product',
    params: { productId }
  })
}

const onAddProductionOrder = (productionOrder) => {
  const product = products.value.find(({ id }) => productionOrder.product.id === id)
  product.qtyWip += productionOrder.qty
}

const onIncrementProduct = (data) => {
  const index = products.value.findIndex(({ id }) => data.id === id)
  Object.assign(products.value[index], data)
}

onMounted(async () => products.value = await api.product.getAll())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Inventory" title="Products">
      <template #actions>
        <CfOutlinedButton @click="currentAction = 'CREATE'">
          Add product
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <ProductsList
      :data="products"
      @action="onProductsListAction"
    />
  </CfAppView>

  <CreateProduct
    @success="onCreateProduct"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <AddProductionOrder
    :product="product"
    @success="onAddProductionOrder"
    @cancel="currentAction = product = null"
    v-if="currentAction === 'MAKE'"
  />

  <IncrementProduct
    :data="product"
    @success="onIncrementProduct"
    @cancel="currentAction = product = null"
    v-if="currentAction === 'ADJUST'"
  />
</template>