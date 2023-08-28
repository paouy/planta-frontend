<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { snakeToSentence } from '../helpers.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfSummaryList, CfActionCard, CfOutlinedButton, CfFilledButton } from 'vue-cf-ui'
import { IncrementAllocation } from '../features/allocation/index.js'
import { CreateFulfillment, FulfillmentsList } from '../features/fulfillment/index.js'
import { CreateProductionOrder } from '../features/productionOrder/index.js'
import { ArchiveSalesOrder, ConfirmSalesOrder, ForceFulfillSalesOrder, RemoveSalesOrder } from '../features/salesOrder/index.js'
import { CreateSalesOrderItem, DeleteSalesOrderItem, SalesOrderItemsList, UpdateSalesOrderItemQty } from '../features/salesOrderItem/index.js'
import api from '../api/index.js'

const router = useRouter()
const props = defineProps({ salesOrderId: String })

const salesOrder = ref({
  status: '',
  isArchived: null,
  publicId: '',
  customer: {
    shortName: ''
  },
  date: null,
  items: []
})
const salesOrderItems = ref([])
const fulfillments = ref([])
const salesOrderItem = ref(null)
const currentAction = ref({
  salesOrder: null,
  salesOrderItem: null
})

const breadcrumbs = computed(() => {
  const root = salesOrder.value.isArchived
    ? { name: 'Archived Orders', path: '/sales/orders/archived' }
    : { name: 'Orders', path: '/sales/orders' }

  return [root, { name: salesOrder.value.publicId }]
})
const summary = computed(() => ([
  {
    label: 'Status',
    value: snakeToSentence(salesOrder.value.status)
  }, {
    label: 'Customer',
    value: salesOrder.value.customer.shortName
  }, {
    label: 'Date',
    value: salesOrder.value.date
  }
]))
const allowForceFulfill = computed(() => {
  const hasQtyWip = salesOrderItems.value.map(({ qtyWip }) => qtyWip).some(qty => qty > 0)
  return salesOrder.value.status === 'PARTIALLY_FULFILLED' && !hasQtyWip
})

const onSalesOrderItemAction = ({ key, data }) => {
  currentAction.value.salesOrderItem = key
  salesOrderItem.value = data
}

const onConfirmSalesOrder = () => {
  salesOrder.value.status = 'CONFIRMED'
  salesOrderItems.value.forEach((_, index) => {
    salesOrderItems.value[index].publicId = `${salesOrder.value.publicId}/${index + 1}`
  })
}

const onCreateSalesOrderItem = ({ salesOrderId, ...data }) => {
  salesOrderItems.value.push(data)
}

const onUpdateSalesOrderItemQty = (data) => {
  const item = salesOrderItems.value.find(({ id }) => data.id === id)
  item.qty = data.qty
}

const onDeleteSalesOrderItem = (id) => {
  const itemIndex = salesOrderItems.value
    .findIndex(salesOrderItem => salesOrderItem.id === id)

  salesOrderItems.value.splice(itemIndex, 1)
}

const onCreateProductionOrder = ({ salesOrderItemId, qty }) => {
  const item = salesOrderItems.value.find(({ id }) => salesOrderItemId === id)
  item.qtyWip += qty
  item.productionOrderCount++
}

const onIncrementAllocation = ({ salesOrderItem, qty }) => {
  const item = salesOrderItems.value.find(({ id }) => salesOrderItem.id === id)
  item.qtyAllocated += qty
}

const onCreateFulfillment = ({ salesOrderItemId, qty }) => {
  const item = salesOrderItems.value.find(({ id }) => salesOrderItemId === id)
  item.qtyFulfilled += qty
  item.qtyAllocated -= qty

  const isSalesOrderPartiallyFulfilled = salesOrderItems.value
    .map(({ qty, qtyFulfilled }) => qtyFulfilled >= qty )
    .some(value => value === false)

  salesOrder.value.status = isSalesOrderPartiallyFulfilled ? 'PARTIALLY_FULFILLED' : 'FULFILLED'
}

api.salesOrder
  .getOne(props.salesOrderId)
  .then(data => salesOrder.value = data)

api.salesOrderItem
  .getAllBySalesOrder(props.salesOrderId)
  .then(data => salesOrderItems.value = data)

api.fulfillment
  .getAllBySalesOrder(props.salesOrderId)
  .then(data => fulfillments.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="salesOrder.publicId">
      <template #actions>
        <CfFilledButton
          :disabled="salesOrderItems.length === 0"
          @click="currentAction.salesOrder = 'CONFIRM'"
          v-if="salesOrder.status === 'OPEN'"
        >
          Confirm order
        </CfFilledButton>
        <CfOutlinedButton
          @click="currentAction.salesOrder = 'FORCE_FULFILL'"
          v-if="allowForceFulfill"
        >
          Mark as fulfilled
        </CfOutlinedButton>
        <CfFilledButton
          @click="currentAction.salesOrder = 'ARCHIVE'"
          v-if="salesOrder.status === 'FULFILLED' && !salesOrder.isArchived"
        >
          Archive order
        </CfFilledButton>
      </template>
    </CfAppViewHeader>

    <CfHeader title="Overview"/>
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
      :data="salesOrderItems"
      :sales-order="salesOrder"
      @action="onSalesOrderItemAction"
    />

    <CfHeader title="Fulfillments" v-if="salesOrder.status !== 'OPEN'"/>
    <FulfillmentsList :data="fulfillments" v-if="salesOrder.status !== 'OPEN'"/>

    <CfHeader title="Remove order" v-if="!salesOrder.isArchived"/>
    <CfActionCard simple v-if="!salesOrder.isArchived">
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
    @success="onConfirmSalesOrder"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'CONFIRM'"
  />

  <ForceFulfillSalesOrder
    :data="salesOrder"
    @success="salesOrder.status = 'FULFILLED'"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'FORCE_FULFILL'"
  />

  <ArchiveSalesOrder
    :data="salesOrder"
    @success="router.push({ name: 'SalesOrders' })"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'ARCHIVE'"
  />

  <RemoveSalesOrder
    :data="salesOrder"
    @success="router.push({ name: 'SalesOrders' })"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'REMOVE'"
  />

  <CreateSalesOrderItem
    :sales-order="salesOrder"
    :sales-order-items="salesOrderItems"
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

  <CreateProductionOrder
    :sales-order-item="salesOrderItem"
    @success="onCreateProductionOrder"
    @cancel="currentAction.salesOrderItem = salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'MAKE'"
  />

  <IncrementAllocation
    :sales-order-item="salesOrderItem"
    @success="onIncrementAllocation"
    @cancel="currentAction.salesOrderItem = salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'ALLOCATE'"
  />

  <CreateFulfillment
    :sales-order-item="salesOrderItem"
    @success="onCreateFulfillment"
    @cancel="currentAction.salesOrderItem = salesOrderItem = null"
    v-if="currentAction.salesOrderItem === 'FULFILL'"
  />
</template>