<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs } from 'vue-cf-ui'
import { SalesOrdersList } from '../features/salesOrder/index.js'
import api from '../api/index.js'

const router = useRouter()
const breadcrumbs = [{ name: 'Orders', path: '/sales/orders' }, { name: 'Archived Orders' }]

const salesOrders = ref([])

const onView = ({ data }) => {
  router.push({
    name: 'SalesOrder',
    params: {
      salesOrderId: data.id
    }
  })
}

api.salesOrder
  .getAll({ isArchived: true })
  .then(data => salesOrders.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Archived Orders"/>
    <SalesOrdersList
      :data="salesOrders"
      @action="onView"
    />
  </CfAppView>
</template>