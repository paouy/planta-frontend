<script setup>
import { useRouter } from 'vue-router'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from 'vue-cf-ui'
import { CreateProduct } from '../features/product/index.js'

const router = useRouter()
const breadcrumbs = [{ name: 'Products', path: '/inventory/products' }]

const onSuccess = ({ id }) => {
  router.push({
    name: 'Product',
    params: {
      productId: id
    }
  })
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Add product"/>
    <CreateProduct
      @success="onSuccess"
      @cancel="router.push('/inventory/products')"
    />
  </CfAppView>
</template>