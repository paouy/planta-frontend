<script setup>
import { ref } from 'vue'
import { useProductionOrderStore } from '../store.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from 'vue-cf-ui'
import ProductionOrdersSummary from '../components/ProductionOrdersSummary.vue'
import ProductionOrdersList from '../components/ProductionOrdersList.vue'
import CreateProductionOrder from '../components/CreateProductionOrder.vue'
import UpdateProductionOrderPriority from '../components/UpdateProductionOrderPriority.vue'
import api from '../../../api/index.js'

const { productionOrders, ...productionOrderStore } = useProductionOrderStore()

const releasedCount = ref(0)
const productionOrder = ref(null)
const currentAction = ref(null)

const onProductionOrderAction = ({ key, data }) => {
  productionOrder.value = data
  currentAction.value = key
}

api.productionOrder
  .getAllNotReleased()
  .then(productionOrderStore.set)

api.lookup
  .get('releasedProductionOrderCount')
  .then(data => releasedCount.value = data.releasedProductionOrderCount)
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
    <ProductionOrdersSummary
      :production-orders="productionOrders"
      :released-count="releasedCount"
    />
    <ProductionOrdersList
      :data="productionOrders"
      @action="onProductionOrderAction"
    />
  </CfAppView>

  <CreateProductionOrder
    @success="productionOrderStore.create"
    @cancel="currentAction = null"
    v-if="currentAction === 'ADD'"
  />

  <UpdateProductionOrderPriority
    :data="productionOrder"
    :production-orders="productionOrders"
    @success="productionOrderStore.reprioritize"
    @cancel="currentAction = productionOrder = null"
    v-if="currentAction === 'REPRIORITIZE'"
  />
</template>