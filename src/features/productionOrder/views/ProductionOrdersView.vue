<script setup>
import { ref, onMounted } from 'vue'
import { getProductionOrders } from '../api/index.js'
import {
  CfAppView,
  CfAppViewHeader,
  CfOutlinedButton
} from '../../../components/index.js'
import ProductionOrdersList from '../components/ProductionOrdersList.vue'

const productionOrders = ref([])

onMounted(async () => productionOrders.value = await getProductionOrders())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Overview">
      <template #actions>
        <CfOutlinedButton>
          Create order
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <ProductionOrdersList :data="productionOrders"/>
  </CfAppView>
</template>