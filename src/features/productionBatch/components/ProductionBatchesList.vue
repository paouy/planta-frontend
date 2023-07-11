<script setup>
import { CfDataTable } from '../../../components/index.js'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const columns = [
  {
    label: 'ID',
    key: 'friendlyId'
  }, {
    label: 'Schedule',
    key: 'schedule'
  }, {
    label: 'Qty',
    key: 'qtyExpected'
  }, {
    label: 'Status',
    key: 'status'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    :item-actions="['Add record', 'View']"
  />
</template>