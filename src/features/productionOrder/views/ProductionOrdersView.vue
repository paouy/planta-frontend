<script setup>
import { ref, onMounted } from 'vue'
import { getProductionOrders } from '../api/index.js'
import {
  CfAppView,
  CfAppViewHeader,
  CfOutlinedButton
} from '../../../components/index.js'
import ProductionOrdersSummary from '../components/ProductionOrdersSummary.vue'
import ProductionOrdersList from '../components/ProductionOrdersList.vue'
import AddProductionOrder from '../components/AddProductionOrder.vue'

const productionOrders = ref([])
const showAddProductionOrder = ref(false)

const onAddProductionOrderSuccess = (productionOrder) => {
  productionOrders.value.push({
    ...productionOrder,
    seq: productionOrders.value.length + 1
  })
}

onMounted(async () => productionOrders.value = await getProductionOrders())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Overview">
      <template #actions>
        <CfOutlinedButton @click="showAddProductionOrder = true">
          Create order
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <ProductionOrdersSummary :data="productionOrders"/>
    <ProductionOrdersList :data="productionOrders"/>
    <AddProductionOrder
      @success="onAddProductionOrderSuccess"
      @cancel="showAddProductionOrder = false"
      v-if="showAddProductionOrder"
    />
  </CfAppView>
</template>