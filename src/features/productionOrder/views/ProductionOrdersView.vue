<script setup>
import { ref, onMounted } from 'vue'
import { useProductionOrderStore } from '../store.js'
import { getProductionOrders } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import ProductionOrdersSummary from '../components/ProductionOrdersSummary.vue'
import ProductionOrdersList from '../components/ProductionOrdersList.vue'
import AddProductionOrder from '../components/AddProductionOrder.vue'
import RemoveProductionOrder from '../components/RemoveProductionOrder.vue'

const { productionOrders, ...productionOrderStore } = useProductionOrderStore()
const productionOrder = ref(null)
const currentAction = ref(null)

const onProductionOrderAction = ({ action, item }) => {
  productionOrder.value = item
  currentAction.value = action
}

onMounted(() => getProductionOrders().then(productionOrderStore.initialize))
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Overview">
      <template #actions>
        <CfOutlinedButton @click="currentAction = 'ADD'">
          Create order
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <ProductionOrdersSummary :data="productionOrders"/>
    <ProductionOrdersList
      :data="productionOrders"
      @action="onProductionOrderAction"
    />
  </CfAppView>

  <AddProductionOrder
    @success="productionOrderStore.add"
    @cancel="currentAction = null"
    v-if="currentAction === 'ADD'"
  />

  <RemoveProductionOrder
    :data="productionOrder"
    @success="productionOrderStore.remove"
    @cancel="currentAction = null"
    v-if="currentAction === 'REMOVE'"
  />
</template>