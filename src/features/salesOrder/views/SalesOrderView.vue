<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSalesOrder } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfSummaryList, CfActionCard, CfOutlinedButton, CfFilledButton } from '../../../components/index.js'
import ConfirmSalesOrder from '../components/ConfirmSalesOrder.vue'
import FulfillSalesOrder from '../components/FulfillSalesOrder.vue'
import RemoveSalesOrder from '../components/RemoveSalesOrder.vue'
import SalesOrderItemsList from '../../salesOrderItem/components/SalesOrderItemsList.vue'
import CreateProductionOrder from '../../productionOrder/components/CreateProductionOrder.vue'
import CreateAllocationOrder from '../../allocationOrder/components/CreateAllocationOrder.vue'
import CreateSalesOrderItem from '../../salesOrderItem/components/CreateSalesOrderItem.vue'
import UpdateSalesOrderItemQty from '../../salesOrderItem/components/UpdateSalesOrderItemQty.vue'
import DeleteSalesOrderItem from '../../salesOrderItem/components/DeleteSalesOrderItem.vue'

const breadcrumbs = [{ name: 'Orders', path: '/sales/orders' }]
const router = useRouter()
const props = defineProps({ salesOrderId: String })

const salesOrder = ref({
  status: '',
  customFriendlyId: '',
  customer: {
    shortName: ''
  },
  date: null,
  items: []
})

const salesOrderItem = ref(null)
const currentAction = ref({
  salesOrder: null,
  salesOrderItem: null
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

const onSalesOrderItemAction = ({ key, data }) => {
  currentAction.value.salesOrderItem = key
  salesOrderItem.value = data
}

const onCreateProductionOrder = ({ salesOrderItemId, qty }) => {
  const item = salesOrder.value.items.find(({ id }) => salesOrderItemId === id)
  item.qtyWip = item.qtyWip + qty
}

const onCreateAllocationOrder = ({ salesOrderItem, qty }) => {
  const item = salesOrder.value.items.find(({ id }) => salesOrderItem.id === id)
  item.qtyAllocated = item.qtyAllocated + qty
}

const onCreateSalesOrderItem = ({ salesOrderId, ...data }) => {
  salesOrder.value.items.push(data)
}

const onUpdateSalesOrderItemQty = (data) => {
  const item = salesOrder.value.items.find(({ id }) => data.id === id)
  item.qty = data.qty
}

const onDeleteSalesOrderItem = (data) => {
  const itemIndex = salesOrder.value.items.findIndex(({ id }) => data.id === id)

  salesOrder.value.items.splice(itemIndex, 1)

  salesOrder.value.items.map((item, index) => ({ ...item, seq: index + 1 }))
}

onMounted(async () => salesOrder.value = await getSalesOrder(props.salesOrderId))
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="salesOrder.customFriendlyId">
      <template #actions>
        <CfFilledButton
          :disabled="salesOrder.items.length === 0"
          @click="currentAction.salesOrder = 'CONFIRM'"
          v-if="salesOrder.status === 'OPEN'"
        >
          Confirm order
        </CfFilledButton>
        <CfFilledButton
          :disabled="salesOrder.items.some(item => !item.qtyAllocated || item.qtyWip)"
          @click="currentAction.salesOrder = 'FULFILL'"
          v-if="salesOrder.status === 'CONFIRMED'"
        >
          Fulfill order
        </CfFilledButton>
      </template>
    </CfAppViewHeader>

    <CfHeader title="Order details"/>
    <CfSummaryList :data="summary"/>

    <CfHeader
      title="Order items"
      :subtitle="salesOrder.status === 'OPEN' ? 'You can add, edit, and remove items until the order is confirmed.' : null"
    >
      <template #action>
        <CfOutlinedButton @click="currentAction.salesOrderItem = 'CREATE'" v-if="salesOrder.status === 'OPEN'">
          Add item
        </CfOutlinedButton>
      </template>
    </CfHeader>
    <SalesOrderItemsList
      :data="salesOrder.items"
      :update-only="salesOrder.status === 'OPEN'"
      @action="onSalesOrderItemAction"
    />

    <CfHeader title="Remove order" v-if="!salesOrder.status.includes('CANCELLED')"/>
    <CfActionCard simple v-if="!salesOrder.status.includes('CANCELLED')">
      <template #body>
        Cancelling or deleting this order is permanent. You will no longer be able to fulfill this order.
      </template>
      <template #action>
        <CfOutlinedButton color="red" @click="currentAction.salesOrder = 'REMOVE'">
          Remove
        </CfOutlinedButton>
      </template>
    </CfActionCard>
  </CfAppView>

  <ConfirmSalesOrder
    :data="salesOrder"
    @success="salesOrder.status = 'CONFIRMED'"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'CONFIRM'"
  />

  <FulfillSalesOrder
    :data="salesOrder"
    @success="salesOrder.status = 'FULFILLED'"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'FULFILL'"
  />

  <RemoveSalesOrder
    :data="salesOrder"
    @success="router.push({ name: 'SalesOrders' })"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'REMOVE'"
  />

  <CreateProductionOrder
    :product="salesOrderItem?.product"
    :sales-order-item-id="salesOrderItem?.id"
    @success="onCreateProductionOrder"
    @cancel="currentAction.salesOrderItem = salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'MAKE'"
  />

  <CreateAllocationOrder
    :product="salesOrderItem?.product"
    :sales-order-item-id="salesOrderItem?.id"
    @success="onCreateAllocationOrder"
    @cancel="currentAction.salesOrderItem = salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'ALLOCATE'"
  />

  <CreateSalesOrderItem
    :sales-order="salesOrder"
    @success="onCreateSalesOrderItem"
    @cancel="currentAction.salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'CREATE'"
  />

  <UpdateSalesOrderItemQty
    :data="salesOrderItem"
    @success="onUpdateSalesOrderItemQty"
    @cancel="currentAction.salesOrderItem = salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'EDIT'"
  />

  <DeleteSalesOrderItem
    :data="salesOrderItem"
    @success="onDeleteSalesOrderItem"
    @cancel="currentAction.salesOrderItem = salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'REMOVE'"
  />
</template>