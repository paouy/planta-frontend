<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProduct } from '../api/index.js'
import { getProductMaterials } from '../../productMaterial/api/index.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfOutlinedButton, CfHeader, CfSummaryList } from '../../../components/index.js'
import UpdateProduct from '../components/UpdateProduct.vue'
import ProductMaterialsList from '../../productMaterial/components/ProductMaterialsList.vue'
import AddProductMaterial from '../../productMaterial/components/AddProductMaterial.vue'
import UpdateProductMaterial from '../../productMaterial/components/UpdateProductMaterial.vue'
import RemoveProductMaterial from '../../productMaterial/components/RemoveProductMaterial.vue'

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

  productMaterials.value[materialIndex] = updatedMaterial
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
    <CfHeader title="Product Details"/>
    <CfSummaryList :data="productSummary"/>

    <CfHeader
      title="Product Materials"
      subtitle="Materials required to produce a single unit of the product."
    >
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

    <UpdateProduct
      :data="product"
      @success="updatedProduct => product = updatedProduct"
      @cancel="showUpdateProduct = false"
      v-if="showUpdateProduct"
    />
  </CfAppView>
</template>