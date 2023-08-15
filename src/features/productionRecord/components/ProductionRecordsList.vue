<script setup>
import { CfDataTable } from 'vue-cf-ui'

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Date',
    key: 'timestamp'
  }, {
    label: 'Operation',
    key: 'operation.name'
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
  >
    <template v-slot:row="{ data }">
      <td>{{ new Date(data.timestamp).toLocaleDateString('en-CA') }}</td>
      <td>{{ data.operation.name }}</td>
      <td>{{ data.type }}</td>
      <td>{{ data.qty }}</td>
    </template>
  </CfDataTable>
</template>