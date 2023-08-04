<script setup>
import { ref, onMounted } from 'vue'
import { useProductionOrderStore } from '../store.js'
import { getProductionOrders } from '../api/index.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import ProductionOrdersSummary from '../components/ProductionOrdersSummary.vue'
import ProductionOrdersList from '../components/ProductionOrdersList.vue'
import AddProductionOrder from '../components/AddProductionOrder.vue'
import RemoveProductionOrder from '../components/RemoveProductionOrder.vue'
import UpdateProductionOrderPriority from '../components/UpdateProductionOrderPriority.vue'
import ReleaseProductionOrder from '../components/ReleaseProductionOrder.vue'

const { productionOrders, ...productionOrderStore } = useProductionOrderStore()
const productionOrder = ref(null)
const currentAction = ref(null)

const onProductionOrderAction = ({ key, data }) => {
  productionOrder.value = data
  currentAction.value = key
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
    @cancel="currentAction = productionOrder = null"
    v-if="currentAction === 'REMOVE'"
  />

  <UpdateProductionOrderPriority
    :data="productionOrder"
    :production-orders="productionOrders"
    @success="productionOrderStore.reprioritize"
    @cancel="currentAction = productionOrder = null"
    v-if="currentAction === 'REPRIORITIZE'"
  />

  <ReleaseProductionOrder
    :data="productionOrder"
    @success="productionOrderStore.remove"
    @cancel="currentAction = null"
    v-if="currentAction === 'RELEASE'"
  />
</template>