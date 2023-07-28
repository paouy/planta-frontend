<script setup>
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from '../../../components/index.js'
import CreateSalesOrder from '../components/CreateSalesOrder.vue'

const breadcrumbs = [{
  name: 'Orders',
  path: '/sales/orders'
}]
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Create sales order"/>
    <CreateSalesOrder/>
  </CfAppView>
</template>