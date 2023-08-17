<script setup>
import { CfDataTable } from 'vue-cf-ui'

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Date',
    key: 'timestamp'
  }, {
    label: 'Workstation',
    key: 'workstation.name'
  }, {
    label: 'Equipment',
    key: 'equipment.name'
  }, {
    label: 'Quantity',
    key: 'qty'
  }, {
    label: 'Worker',
    key: 'worker.name',
    width: '30%'
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
      <td>{{ data.workstation?.name }}</td>
      <td>{{ data.equipment?.name }}</td>
      <td>{{ (data.type === 'REJECT' ? '(' : '') + data.qty + (data.type === 'REJECT' ? ')' : '') }}</td>
      <td>{{ data.worker?.name }}</td>
    </template>
  </CfDataTable>
</template>