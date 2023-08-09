<script setup>
import { CfDataTable } from '../../../components/index.js'

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Operation',
    key: 'operation.name'
  }, {
    label: 'Status',
    key: 'status'
  }, {
    label: 'Output',
    key: 'qtyOutput'
  }, {
    label: 'Reject',
    key: 'qtyReject'
  }, {
    label: 'Rework',
    key: 'qtyRework'
  }, {
    label: 'Shortfall',
    key: 'qtyShortfall'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
  />
</template>