<script setup>
import { computed } from 'vue'
import StatsCard from '../../../components/StatsCard.vue'

const props = defineProps({ productionRecords: Array })

const data = computed(() => {
  const productionOrderCount = new Set(props.productionRecords.map(({ productionOrderPublicId: publicId }) => publicId)).size

  const totalQty = props.productionRecords
    .filter(({ type }) => type !== 'REJECT')
    .reduce((total, { qty }) => total + qty, 0)

  const totalTimeTakenMins = props.productionRecords
    .filter(({ type }) => type !== 'REJECT')
    .reduce((total, { timeTakenMins }) => total + timeTakenMins, 0)

  const totalTimeEstimatedMins = props.productionRecords
    .filter(({ type }) => type !== 'REJECT')
    .reduce((total, { timeEstimatedMins }) => total + timeEstimatedMins, 0)

  const limitDecimalPlaces = (number) => {
    const roundedNumber = number.toFixed(1)
    return parseFloat(roundedNumber) === number ? number : roundedNumber
  }

  return [
    {
      label: 'Orders',
      value: productionOrderCount
    }, {
      label: 'Units',
      value: totalQty
    }, {
      label: 'Labor hours',
      value: limitDecimalPlaces(totalTimeTakenMins / 60)
    }, {
      label: 'Estimated hours',
      value: limitDecimalPlaces(totalTimeEstimatedMins / 60)
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