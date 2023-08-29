<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from 'vue-cf-ui'
import { UpdateProduct } from '../features/product/index.js'
import api from '../api/index.js'

const router = useRouter()
const props = defineProps({ productId: String })

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

const breadcrumbs = computed(() => [{
  name: 'Back',
  path: `/inventory/products/${props.productId}`
}]) 

const onSuccess = ({ id }) => {
  router.push({
    name: 'Product',
    params: {
      productId: id
    }
  })
}

api.product
  .getOne(props.productId)
  .then(data => product.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Edit product"/>
    <UpdateProduct
      :data="product"
      @success="onSuccess"
      @cancel="router.push(`/inventory/products/${props.productId}`)"
    />
  </CfAppView>
</template>