<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getProduct } from '../api/index.js'
import { getProductMaterials } from '../../productMaterial/api/index.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfOutlinedButton, CfHeader, CfSummaryList, CfActionCard } from '../../../components/index.js'
import UpdateProduct from '../components/UpdateProduct.vue'
import RemoveProduct from '../components/RemoveProduct.vue'
import ProductMaterialsList from '../../productMaterial/components/ProductMaterialsList.vue'
import AddProductMaterial from '../../productMaterial/components/AddProductMaterial.vue'
import UpdateProductMaterial from '../../productMaterial/components/UpdateProductMaterial.vue'
import RemoveProductMaterial from '../../productMaterial/components/RemoveProductMaterial.vue'

const breadcrumbs = [{ name: 'Products', path: '/inventory/products' }]
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
  collection: {
    id: '',
    name: ''
  }
})
const productMaterials = ref([])
const productMaterial = ref(null)

const productSummary = computed(() => {
  return [
    {
      label: 'Collection',
      value: product.value.collection.name
    }, {
      label: 'SKU',
      value: product.value.sku
    }, {
      label: 'UOM',
      value: product.value.uom
    }, {
      label: 'Operations',
      value: product.value.operations.map(({name}) => name).join(', ')
    }
  ]
})

onMounted(() => {
  getProduct(props.productId).then(data => product.value = data)
  getProductMaterials(props.productId).then(data => productMaterials.value = data)
})

const productMaterialActions = {
  add: (data) => productMaterials.value.push(data),
  update: (data) => {
    const index = productMaterials.value.findIndex(({ id }) => data.id === id)
    Object.assign(productMaterials.value[index], data)
  },
  remove: (index) => productMaterials.value.splice(index, 1)
}

const onProductMaterialListAction = ({ action, data }) => {
  currentAction.value.materials = action
  productMaterial.value = data
}
</script>

<template>
  <CfAppView v-if="product.id">
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="product.name">
      <template #actions>
        <CfOutlinedButton @click="currentAction.product = 'EDIT'">
          Edit product
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>

    <CfHeader title="Product details"/>
    <CfSummaryList :data="productSummary"/>

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

  <UpdateProduct
    :data="product"
    @success="updatedProduct => product = updatedProduct"
    @cancel="currentAction.product = null"
    v-if="currentAction.product === 'EDIT'"
  />
  <RemoveProduct
    :data="product"
    @success="router.push({ name: 'Products' })"
    @cancel="currentAction.product = null"
    v-if="currentAction.product === 'REMOVE'"
  />

  <AddProductMaterial
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
  <RemoveProductMaterial
    :data="productMaterial"
    @success="productMaterialActions.remove"
    @cancel="currentAction.materials = productMaterial = null"
    v-if="currentAction.materials === 'REMOVE'"
  />
</template>