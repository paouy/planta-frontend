<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs } from 'vue-cf-ui'
import { ReleasedProductionOrdersList } from '../features/productionOrder/index.js'
import api from '../api/index.js'

const router = useRouter()
const breadcrumbs = [{ name: 'Overview', path: '/production/overview' }, { name: 'Released Orders' }]

const productionOrders = ref([])

const onView = ({ data }) => {
  router.push({
    name: 'ProductionOrder',
    params: {
      productionOrderId: data.id
    }
  })
}

api.productionOrder
  .getAllReleased()
  .then(data => productionOrders.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Released Orders"/>
    <ReleasedProductionOrdersList
      :data="productionOrders"
      @action="onView"
    />
  </CfAppView>
</template>