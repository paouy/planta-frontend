<script setup>
import { ref } from 'vue'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from 'vue-cf-ui'
import { useProductionOrderStore, CreateProductionOrder, ProductionOrdersList, ProductionOrdersSummary, UpdateProductionOrderPriority } from '../features/productionOrder/index.js'
import api from '../api/index.js'

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