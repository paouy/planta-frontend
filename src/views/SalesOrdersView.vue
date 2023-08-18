<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { SalesOrdersList, SalesOrdersSummary } from '../features/salesOrder/index.js'
import api from '../api/index.js'

const router = useRouter()
const salesOrders = ref([])
const archivedCount = ref(0)

const onView = ({ data }) => {
  router.push({
    name: 'SalesOrder',
    params: {
      salesOrderId: data.id
    }
  })
}

api.salesOrder
  .getAll()
  .then(data => salesOrders.value = data)

api.lookup
  .get('archivedSalesOrderCount')
  .then(data => archivedCount.value = data.archivedSalesOrderCount)
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Sales" title="Orders">
      <template #actions>
        <CfFilledButton :to="{ name: 'CreateSalesOrder' }">
          Create order
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <SalesOrdersSummary
      :sales-orders="salesOrders"
      :archived-count="archivedCount"
    />
    <SalesOrdersList
      :data="salesOrders"
      @action="onView"
    />
  </CfAppView>
</template>