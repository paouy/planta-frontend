<script setup>
import { CfDataTable } from '../../../components/index.js'

const props = defineProps({ data: Array })
const columns = [
  {
    label: 'Sales Order',
    key: 'salesOrderItem.publicId'
  }, {
    label: 'Quantity',
    key: 'qty'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
  />
</template>