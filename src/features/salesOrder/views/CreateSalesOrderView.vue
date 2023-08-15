<script setup>
import { useRouter } from 'vue-router'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from 'vue-cf-ui'
import CreateSalesOrder from '../components/CreateSalesOrder.vue'

const router = useRouter()
const breadcrumbs = [{ name: 'Orders', path: '/sales/orders' }]

const onSuccess = ({ id }) => {
  router.push({
    name: 'SalesOrder',
    params: {
      salesOrderId: id
    }
  })
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Create sales order"/>
    <CreateSalesOrder
      @success="onSuccess"
      @cancel="router.push('/sales/orders')"
    />
  </CfAppView>
</template>