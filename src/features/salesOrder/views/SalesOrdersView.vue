<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import SalesOrdersSummary from '../components/SalesOrdersSummary.vue'
import SalesOrdersList from '../components/SalesOrdersList.vue'
import api from '../../../api/index.js'

const router = useRouter()
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
  .getAllNotFulfilled()
  .then(data => salesOrders.value = data)
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Sales" title="Orders">
      <template #actions>
        <CfOutlinedButton :to="{ name: 'CreateSalesOrder' }">
          Create order
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <SalesOrdersSummary :data="salesOrders"/>
    <SalesOrdersList
      :data="salesOrders"
      @action="onView"
    />
  </CfAppView>
</template>