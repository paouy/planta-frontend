<script setup>
import { ref, computed, onMounted } from 'vue'
import { getSalesOrder } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfSummaryList } from '../../../components/index.js'
import SalesOrderItemsList from '../../salesOrderItem/components/SalesOrderItemsList.vue'
import AddProductionOrderVue from '../../productionOrder/components/AddProductionOrder.vue'
import CreateAllocationOrder from '../../allocationOrder/components/CreateAllocationOrder.vue'

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

const salesOrderItem = ref(null)
const currentAction = ref(null)

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

const onSalesOrderItemAction = ({ action, data }) => {
  currentAction.value = action
  salesOrderItem.value = data
}

const onAddProductionOrder = ({ salesOrderItemId, qty }) => {
  const item = salesOrder.value.items.find(({ id }) => salesOrderItemId === id)
  item.qtyWip = item.qtyWip + qty
}

const onCreateAllocationOrder = ({ salesOrderItemId, qty }) => {
  const item = salesOrder.value.items.find(({ id }) => salesOrderItemId === id)
  item.qtyAllocated = item.qtyAllocated + qty
}
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
    <SalesOrderItemsList
      :data="salesOrder.items"
      @action="onSalesOrderItemAction"
    />
  </CfAppView>

  <AddProductionOrderVue
    :product="salesOrderItem?.product"
    :sales-order-item-id="salesOrderItem?.id"
    @success="onAddProductionOrder"
    @cancel="currentAction = salesOrderItem = null"
    v-if="currentAction === 'MAKE'"
  />

  <CreateAllocationOrder
    :product="salesOrderItem?.product"
    :sales-order-item-id="salesOrderItem?.id"
    @success="onCreateAllocationOrder"
    @cancel="currentAction = salesOrderItem = null"
    v-if="currentAction === 'ALLOCATE'"
  />
</template>