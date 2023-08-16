<script setup>
import { computed } from 'vue'
import StatsCard from '../../../components/StatsCard.vue'

const props = defineProps({ productionRecords: Array })

const data = computed(() => {
  return [
    {
      label: 'Orders',
      value: 0
    }, {
      label: 'Units',
      value: 0
    }, {
      label: 'Labor hours',
      value: 0
    }, {
      label: 'Estimated hours',
      value: 0
    }
  ]
})
</script>

<template>
  <StatsCard
    title="Summary"
    :description="`There are ${props.productionRecords.length} production records.`"
    :data="data"
  />
</template>