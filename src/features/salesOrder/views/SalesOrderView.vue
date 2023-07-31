<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSalesOrder } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfSummaryList } from '../../../components/index.js'
import SalesOrderItemsList from '../../salesOrderItem/components/SalesOrderItemsList.vue'

const breadcrumbs = [{ name: 'Orders', path: '/sales/orders' }]

const props = defineProps({ salesOrderId: String })

const salesOrder = ref({
  friendlyId: '',
  customer: {
    shortName: ''
  },
  date: null,
  items: []
})

const summary = computed(() => {
  return [
    {
      label: 'Status',
      value: salesOrder.value.status
    }, {
      label: 'Customer',
      value: salesOrder.value.customer.shortName
    }, {
      label: 'Date',
      value: salesOrder.value.date
    }
  ]
})
/**
 * Details
 * SalesOrderItemsList
 * Cancel
 * Delete
 */

onMounted(async () => salesOrder.value = await getSalesOrder(props.salesOrderId))
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="salesOrder.friendlyId"/>

    <CfHeader title="Order details"/>
    <CfSummaryList :data="summary"/>

    <CfHeader title="Order items"/>
    <SalesOrderItemsList :data="salesOrder.items"/>
  </CfAppView>
</template>