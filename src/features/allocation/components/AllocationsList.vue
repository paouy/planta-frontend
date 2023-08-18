<script setup>
import { CfDataTable } from 'vue-cf-ui'

const props = defineProps({ data: Array })
const columns = [
  {
    label: 'Sales Order ID',
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