<script setup>
import { ref, computed, onMounted } from 'vue'
import { getProductionOrder } from '../api/index.js'
import { getProductionRecords } from '../../productionRecord/api/index.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfSummaryList } from '../../../components/index.js'
import ProductionOrderTally from '../components/ProductionOrderTally.vue'
import ProductionRecordsList from '../../productionRecord/components/ProductionRecordsList.vue'

const breadcrumbs = [{ name: 'Overview', path: '/production/overview' }]

const props = defineProps({ productionOrderId: String })

const productionOrder = ref({
  friendlyId: '',
  status: '',
  product: {
    name: '',
    uom: ''
  },
  dueDate: null,
  operations: []
})
const productionRecords = ref([])

const summary = computed(() => {
  return [
    {
      label: 'Status',
      value: productionOrder.value.status
    }, {
      label: 'Product',
      value: productionOrder.value.product?.name
    }, {
      label: 'Quantity',
      value: `${productionOrder.value.qty} ${productionOrder.value.product?.uom}`
    }, {
      label: 'Due Date',
      value: productionOrder.value.dueDate
    }
  ]
})

onMounted(() => {
  getProductionOrder(props.productionOrderId).then(data => productionOrder.value = data)
  getProductionRecords(props.productionOrderId).then(data => productionRecords.value = data)
})
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="productionOrder.friendlyId"/>

    <CfHeader title="Production details"/>
    <CfSummaryList :data="summary"/>

    <CfHeader title="Production tally"/>
    <ProductionOrderTally :data="productionOrder.operations"/>

    <CfHeader title="Production log"/>
    <ProductionRecordsList :data="productionRecords"/>
  </CfAppView>
</template>