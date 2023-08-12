<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfSummaryList, CfActionCard, CfOutlinedButton, CfFilledButton } from '../../../components/index.js'
import ConfirmSalesOrder from '../components/ConfirmSalesOrder.vue'
import RemoveSalesOrder from '../components/RemoveSalesOrder.vue'
import SalesOrderItemsList from '../../salesOrderItem/components/SalesOrderItemsList.vue'
import CreateProductionOrder from '../../productionOrder/components/CreateProductionOrder.vue'
import IncrementAllocation from '../../allocation/components/IncrementAllocation.vue'
import CreateSalesOrderItem from '../../salesOrderItem/components/CreateSalesOrderItem.vue'
import UpdateSalesOrderItemQty from '../../salesOrderItem/components/UpdateSalesOrderItemQty.vue'
import DeleteSalesOrderItem from '../../salesOrderItem/components/DeleteSalesOrderItem.vue'
import api from '../../../api/index.js'

const breadcrumbs = [{ name: 'Orders', path: '/sales/orders' }]
const router = useRouter()
const props = defineProps({ salesOrderId: String })

const salesOrder = ref({
  status: '',
  publicId: '',
  customer: {
    shortName: ''
  },
  date: null,
  items: []
})
const salesOrderItems = ref([])
const salesOrderItem = ref(null)
const currentAction = ref({
  salesOrder: null,
  salesOrderItem: null
})

const summary = computed(() => ([
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
]))

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

api.salesOrder
  .getOne(props.salesOrderId)
  .then(data => salesOrder.value = data)

api.salesOrderItem
  .getAllBySalesOrder(props.salesOrderId)
  .then(data => salesOrderItems.value = data)
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
      :data="salesOrderItems"
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
    @success="onConfirmSalesOrder"
    @cancel="currentAction.salesOrder = null"
    v-if="currentAction.salesOrder === 'CONFIRM'"
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
</template>