<script setup>
import { ref } from 'vue'
import { useProductionOrderStore } from '../store.js'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import ProductionOrdersSummary from '../components/ProductionOrdersSummary.vue'
import ProductionOrdersList from '../components/ProductionOrdersList.vue'
import CreateProductionOrder from '../components/CreateProductionOrder.vue'
import DeleteProductionOrder from '../components/DeleteProductionOrder.vue'
import UpdateProductionOrderPriority from '../components/UpdateProductionOrderPriority.vue'
import ReleaseProductionOrder from '../components/ReleaseProductionOrder.vue'
import api from '../../../api/index.js'

const { productionOrders, ...productionOrderStore } = useProductionOrderStore()

const productionOrder = ref(null)
const currentAction = ref(null)

const onProductionOrderAction = ({ key, data }) => {
  productionOrder.value = data
  currentAction.value = key
}

api.productionOrder.getAllNotReleased().then(productionOrderStore.set)
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

  <CreateProductionOrder
    @success="productionOrderStore.create"
    @cancel="currentAction = null"
    v-if="currentAction === 'ADD'"
  />

  <DeleteProductionOrder
    :data="productionOrder"
    @success="productionOrderStore.remove"
    @cancel="currentAction = productionOrder = null"
    v-if="currentAction === 'DELETE'"
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