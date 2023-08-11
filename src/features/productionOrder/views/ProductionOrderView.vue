<script setup>
import { ref, computed } from 'vue'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfSummaryList } from '../../../components/index.js'
import JobsList from '../../job/components/JobsList.vue'
import ProductionRecordsList from '../../productionRecord/components/ProductionRecordsList.vue'
import api from '../../../api/index.js'

const breadcrumbs = [{ name: 'Overview', path: '/production/overview' }]
const props = defineProps({ productionOrderId: String })

const productionOrder = ref({
  publicId: '',
  product: {
    normalizedName: '',
    uom: ''
  },
  status: '',
  qty: null,
  dueDate: null
})
const jobs = ref([])
const productionRecords = ref([])

const summary = computed(() => ([
  {
    label: 'Status',
    value: productionOrder.value.status
  }, {
    label: 'Product',
    value: productionOrder.value.product.normalizedName
  }, {
    label: 'Quantity',
    value: `${productionOrder.value.qty} ${productionOrder.value.product.uom}`
  }, {
    label: 'Due Date',
    value: productionOrder.value.dueDate
  }
]))

api.productionOrder
  .getOne(props.productionOrderId)
  .then(data => productionOrder.value = data)

api.job
  .getAll({ productionOrderId: props.productionOrderId })
  .then(data => jobs.value = data)

api.productionRecord
  .getAllByProductionOrder(props.productionOrderId)
  .then(data => productionRecords.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="productionOrder.publicId"/>

    <CfHeader title="Production details"/>
    <CfSummaryList :data="summary"/>

    <CfHeader title="Jobs"/>
    <JobsList :data="jobs"/>

    <CfHeader title="Production records"/>
    <ProductionRecordsList :data="productionRecords"/>
  </CfAppView>
</template>