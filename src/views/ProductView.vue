<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfOutlinedButton, CfHeader, CfSummaryList, CfActionCard } from 'vue-cf-ui'
import { AllocationsList } from '../features/allocation/index.js'
import { DeleteProduct } from '../features/product/index.js'
import { ProductionOrdersByProductList } from '../features/productionOrder/index.js'
import { CreateProductMaterial, DeleteProductMaterial, ProductMaterialsList, UpdateProductMaterial } from '../features/productMaterial/index.js'
import api from '../api/index.js'

const router = useRouter()
const props = defineProps({ productId: String })

const currentAction = ref({
  product: null,
  materials: null
})
const product = ref({
  id: '',
  name: '',
  sku: '',
  uom: '',
  category: {
    id: '',
    name: ''
  },
  meta: null,
  qtyAvailable: null,
  qtyWip: null
})
const productionOrders = ref([])
const allocations = ref([])
const productMaterials = ref([])
const productMaterial = ref(null)

const breadcrumbs = computed(() => [{ name: 'Products', path: '/inventory/products' }, { name: product.value.sku }])
const productOverview = computed(() => {
  return [
    {
      label: 'Category',
      value: product.value.category.name
    }, {
      label: 'Operations',
      value: product.value.operationIds.length
    }, {
      label: 'SKU',
      value: product.value.sku
    }, {
      label: 'Available',
      value: `${product.value.qtyAvailable} ${product.value.uom}`
    }
  ]
})
const productMeta = computed(() => {
  return Object.entries(product.value.meta).map(([_, meta]) => ({
    label: meta.label,
    value: `${meta.value} ${meta.uom || ''}`
  }))
})

const productMaterialActions = {
  add: (data) => productMaterials.value.push(data),
  update: (data) => {
    const index = productMaterials.value.findIndex(({ id }) => data.id === id)
    Object.assign(productMaterials.value[index], data)
  },
  remove: (id) => {
    const index = productMaterials.value.findIndex(pm => id === pm.id)
    productMaterials.value.splice(index, 1)
  }
}

const onProductMaterialListAction = ({ key, data }) => {
  currentAction.value.materials = key
  productMaterial.value = data
}

api.product
  .getOne(props.productId)
  .then(data => product.value = data)

api.productMaterial
  .getAll(props.productId)
  .then(data => productMaterials.value = data)

api.productionOrder
  .getAllNotReleased({ productId: props.productId })
  .then(data => productionOrders.value = data)

api.allocation
  .getAll({ productId: props.productId })
  .then(data => allocations.value = data)
</script>

<template>
  <CfAppView v-if="product.id">
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="product.name">
      <template #actions>
        <CfOutlinedButton
          :disabled="!!product.qtyWip"
          :to="{ name: 'UpdateProduct', params: { productId: product.id } }"
        >
          Edit product
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>

    <CfHeader title="Overview"/>
    <CfSummaryList :data="productOverview"/>

    <CfHeader title="Other details" v-if="product.meta"/>
    <CfSummaryList :data="productMeta" v-if="product.meta"/>

    <CfHeader title="Product materials" subtitle="Materials required to produce a single unit of the product.">
      <template #action>
        <CfOutlinedButton @click="currentAction.materials = 'ADD'">
          Add material
        </CfOutlinedButton>
      </template>
    </CfHeader>
    <ProductMaterialsList
      :data="productMaterials"
      @action="onProductMaterialListAction"
    />

    <CfHeader title="Production orders"/>
    <ProductionOrdersByProductList :data="productionOrders"/>

    <CfHeader title="Allocation"/>
    <AllocationsList :data="allocations"/>

    <CfHeader title="Remove product"/>
    <CfActionCard simple>
      <template #body>
        Removing this product is permanent. You will no longer be able to make orders for this product.
      </template>
      <template #action>
        <CfOutlinedButton color="red" @click="currentAction.product = 'REMOVE'">
          Remove
        </CfOutlinedButton>
      </template>
    </CfActionCard>
  </CfAppView>

  <DeleteProduct
    :data="product"
    @success="router.push({ name: 'Products' })"
    @cancel="currentAction.product = null"
    v-if="currentAction.product === 'REMOVE'"
  />

  <CreateProductMaterial
    :product-id="product.id"
    :product-materials="productMaterials"
    @success="productMaterialActions.add"
    @cancel="currentAction.materials = null"
    v-if="currentAction.materials === 'ADD'"
  />
  <UpdateProductMaterial
    :data="productMaterial"
    @success="productMaterialActions.update"
    @cancel="currentAction.materials = productMaterial = null"
    v-if="currentAction.materials === 'EDIT'"
  />
  <DeleteProductMaterial
    :data="productMaterial"
    @success="productMaterialActions.remove"
    @cancel="currentAction.materials = productMaterial = null"
    v-if="currentAction.materials === 'REMOVE'"
  />
</template>