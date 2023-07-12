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

const props = defineProps({ productId: String })

const router = useRouter()

const showUpdateProduct = ref(false)
const showRemoveProduct = ref(false)
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

const productMaterials = ref([])
const productMaterial = ref(null)
const showAddProductMaterial = ref(false)
const showUpdateProductMaterial = ref(false)
const showRemoveProductMaterial = ref(false)

const onProductMaterialsListAction = ({ action, item }) => {
  if (action === 'Edit') {
    showUpdateProductMaterial.value = true
  }
  
  if (action === 'Remove') {
    showRemoveProductMaterial.value = true
  }

  productMaterial.value = item
}

const onAddProductMaterialSuccess = (addedMaterial) => {
  productMaterials.value.push(addedMaterial)
}

const onUpdateProductMaterialSuccess = (updatedMaterial) => {
  const materialIndex = productMaterials.value
    .findIndex(({ id }) => id === updatedMaterial.id)

  Object.assign(productMaterials.value[materialIndex], updatedMaterial)
}

const onRemoveProductMaterialSuccess = (materialIndex) => {
  productMaterials.value.splice(materialIndex, 1)
}

onMounted(async () => {
  const [_product, materials] = await Promise.all([
    getProduct(props.productId),
    getProductMaterials(props.productId)
  ])

  product.value = _product
  productMaterials.value = materials
})
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

    <CfHeader title="Product details"/>
    <CfSummaryList :data="productSummary"/>

    <CfHeader title="Product materials" subtitle="Materials required to produce a single unit of the product.">
      <template #action>
        <CfOutlinedButton @click="showAddProductMaterial = true">
          Add material
        </CfOutlinedButton>
      </template>
    </CfHeader>
    <ProductMaterialsList
      :data="productMaterials"
      @action="onProductMaterialsListAction"
    />

    <CfHeader title="Remove product"/>
    <CfActionCard simple>
      <template #body>
        Removing this product is permanent. You will no longer be able to make orders for this product.
      </template>
      <template #action>
        <CfOutlinedButton color="red" @click="showRemoveProduct = true">
          Remove
        </CfOutlinedButton>
      </template>
    </CfActionCard>
  </CfAppView>

  <UpdateProduct
    :data="product"
    @success="updatedProduct => product = updatedProduct"
    @cancel="showUpdateProduct = false"
    v-if="showUpdateProduct"
  />
  <RemoveProduct
    :data="product"
    @success="router.push({ name: 'Products' })"
    @cancel="showRemoveProduct = false"
    v-if="showRemoveProduct"
  />

  <AddProductMaterial
    :product-id="product.id"
    :product-materials="productMaterials"
    @success="onAddProductMaterialSuccess"
    @cancel="showAddProductMaterial = false"
    v-if="showAddProductMaterial"
  />
  <UpdateProductMaterial
    :data="productMaterial"
    @success="onUpdateProductMaterialSuccess"
    @cancel="showUpdateProductMaterial = false"
    v-if="showUpdateProductMaterial"
  />
  <RemoveProductMaterial
    :data="productMaterial"
    @success="onRemoveProductMaterialSuccess"
    @cancel="showRemoveProductMaterial = false"
    v-if="showRemoveProductMaterial"
  />
</template>