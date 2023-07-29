<script setup>
import { CfDataTable } from '../../../components/index.js'

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Date',
    key: 'date'
  }, {
    label: 'Operation',
    key: 'operationName'
  }, {
    label: 'Type',
    key: 'type'
  }, {
    label: 'Qty',
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