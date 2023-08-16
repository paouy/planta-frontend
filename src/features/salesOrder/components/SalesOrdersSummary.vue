<script setup>
import { computed } from 'vue'
import StatsCard from '../../../components/StatsCard.vue'

const props = defineProps({
  salesOrders: Array,
  archivedCount: Number
})

const data = computed(() => {
  const normalzedStatuses = ['Open', 'Confirmed', 'Partially fulfilled', 'Fulfilled']

  const count = props.salesOrders.reduce((value, { status }) => {
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
    label: 'Archived',
    value: props.archivedCount,
    to: { name: 'ArchivedSalesOrders' }
  })

  return summary
})
</script>

<template>
  <StatsCard
    title="Summary"
    :description="`There are ${props.salesOrders.length} sales orders.`"
    :data="data"
  />
</template>