<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getSalesOrders } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import SalesOrdersList from '../components/SalesOrdersList.vue'

const router = useRouter()
const salesOrders = ref([])

const onView = ({ action, data }) => {
  router.push({
    name: 'SalesOrder',
    params: {
      salesOrderId: data.id
    }
  })
}

onMounted(() => getSalesOrders().then(data => salesOrders.value = data))
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
    <SalesOrdersList
      :data="salesOrders"
      @action="onView"
    />
  </CfAppView>
</template>