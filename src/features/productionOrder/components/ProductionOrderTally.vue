<script setup>
import { CfDataTable } from 'vue-cf-ui'

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Operation',
    key: 'name'
  }, {
    label: 'Output',
    key: 'tally.output'
  }, {
    label: 'Reject',
    key: 'tally.reject'
  }, {
    label: 'Rework',
    key: 'tally.rework'
  }, {
    label: 'Shortfall',
    key: 'tally.shortfall'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
  />
</template>