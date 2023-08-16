<script setup>
import { computed } from 'vue'
import OrdersStatsCard from '../../../components/OrdersStatsCard.vue'

const props = defineProps({
  productionOrders: Array,
  releasedCount: Number
})

const data = computed(() => {
  const normalzedStatuses = ['Open', 'In progress', 'Paused', 'Closed']

  const count = props.productionOrders.reduce((value, { status }) => {
    value[status] = (value[status] || 0) + 1
    return value
  }, {})

  const summary = normalzedStatuses.map(status => {
    return {
      label: status,
      value: count[status.replace(' ', '_').toUpperCase()] || 0
    }
  })

  summary.push({
    label: 'Released',
    value: props.releasedCount,
    to: { name: 'ReleasedProductionOrders' }
  })

  return summary
})
</script>

<template>
  <OrdersStatsCard
    title="Summary"
    :description="`There are ${props.productionOrders.length} production orders.`"
    :data="data"
  />
</template>