<script setup>
import { ref } from 'vue'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import SalesOrdersList from '../components/SalesOrdersList.vue'

const salesOrders = ref([])
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
    />
  </CfAppView>
</template>