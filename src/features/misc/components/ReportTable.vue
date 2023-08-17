<script setup>
import { CfDataTable } from 'vue-cf-ui'

const props = defineProps({ productionRecords: Array })

const columns = [
  {
    label: 'ID',
    key: 'productionOrderPublicId'
  }, {
    label: 'Product',
    key: 'productSku'
  }, {
    label: 'Workstation',
    key: 'workstation.name'
  }, {
    label: 'Equipment',
    key: 'equipment.name'
  }, {
    label: 'Quantity',
    key: 'qty',
    width: '12%'
  }, {
    label: 'Worker',
    key: 'worker.name',
    width: '18%'
  }, {
    label: 'Date',
    key: 'timestamp'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.productionRecords"
    searchable
  >
    <template v-slot:row="{ data }">
      <td>{{ data.productionOrderPublicId }}</td>
      <td>{{ data.productSku }}</td>
      <td>{{ data.workstation?.name }}</td>
      <td>{{ data.equipment?.name }}</td>
      <td>{{ (data.type === 'REJECT' ? '(' : '') + data.qty + (data.type === 'REJECT' ? ')' : '') }}</td>
      <td>{{ data.worker?.name }}</td>
      <td>{{ new Date(data.timestamp).toLocaleDateString('en-CA') }}</td>
    </template>
  </CfDataTable>
</template>