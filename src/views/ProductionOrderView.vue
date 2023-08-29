<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { snakeToSentence } from '../helpers.js'
import { CfAppView, CfAppViewHeader, CfBreadcrumbs, CfHeader, CfActionCard, CfSummaryList, CfFilledButton, CfOutlinedButton } from 'vue-cf-ui'
import { JobsList } from '../features/job/index.js'
import { ReleaseProductionOrder, RemoveProductionOrder } from '../features/productionOrder/index.js'
import { ProductionRecordsList } from '../features/productionRecord/index.js'
import api from '../api/index.js'

const router = useRouter()
const props = defineProps({ productionOrderId: String })

const productionOrder = ref({
  publicId: '',
  product: {
    normalizedName: '',
    uom: ''
  },
  status: '',
  isReleased: null,
  qty: null,
  dueDate: null
})
const jobs = ref([])
const productionRecords = ref([])
const currentAction = ref(null)

const breadcrumbs = computed(() => {
  const root = productionOrder.value.isReleased
    ? { name: 'Released Orders', path: '/production/overview/released' }
    : { name: 'Overview', path: '/production/overview' }

  return [root, { name: productionOrder.value.publicId }]
})
const summary = computed(() => ([
  {
    label: 'Status',
    value: snakeToSentence(productionOrder.value.status)
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
const allowRemoval = computed(() => ['OPEN', 'IN_PROGRESS', 'PAUSED'].includes(productionOrder.value.status))

api.productionOrder
  .getOne(props.productionOrderId)
  .then(data => productionOrder.value = data)

api.job
  .getAll({ productionOrderId: props.productionOrderId })
  .then(data => jobs.value = data)

api.productionRecord
  .getAll({ productionOrderId: props.productionOrderId })
  .then(data => productionRecords.value = data)
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="productionOrder.publicId">
      <template #actions>
        <CfFilledButton
          @click="currentAction = 'RELEASE'"
          v-if="productionOrder.status === 'CLOSED' && !productionOrder.isReleased"
        >
          Release order
        </CfFilledButton>
      </template>
    </CfAppViewHeader>

    <CfHeader title="Overview"/>
    <CfSummaryList :data="summary"/>

    <CfHeader title="Jobs"/>
    <JobsList :data="jobs"/>

    <CfHeader title="Production records"/>
    <ProductionRecordsList :data="productionRecords"/>

    <CfHeader title="Remove production order" v-if="allowRemoval"/>
    <CfActionCard simple v-if="allowRemoval">
      <template #body>
        Cancelling or deleting this production order is permanent.
      </template>
      <template #action>
        <CfOutlinedButton color="red" @click="currentAction = 'REMOVE'">
          Remove
        </CfOutlinedButton>
      </template>
    </CfActionCard>
  </CfAppView>

  <RemoveProductionOrder
    :data="productionOrder"
    @success="router.push({ name: 'ProductionOrders' })"
    @cancel="currentAction = null"
    v-if="currentAction === 'REMOVE'"
  />

  <ReleaseProductionOrder
    :data="productionOrder"
    @success="router.push({ name: 'ProductionOrders' })"
    @cancel="currentAction = null"
    v-if="currentAction === 'RELEASE'"
  />
</template>