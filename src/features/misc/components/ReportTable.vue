<script setup>
import { CfDataTable } from 'vue-cf-ui'

const props = defineProps({ productionRecords: Array })

const columns = [
  {
    label: 'Date',
    key: 'timestamp'
  }, {
    label: 'ID',
    key: 'productionOrderPublicId'
  }, {
    label: 'Operation',
    key: 'operation.name'
  }, {
    label: 'Type',
    key: 'type'
  }, {
    label: 'Qty',
    key: 'qty'
  }, {
    label: 'Workstation',
    key: 'workstation.name'
  }, {
    label: 'Equipment',
    key: 'equipment.name'
  }, {
    label: 'Worker',
    key: 'worker.name'
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
      <td>{{ new Date(data.timestamp).toLocaleDateString('en-CA') }}</td>
      <td>{{ data.productionOrderPublicId }}</td>
      <td>{{ data.operation.name }}</td>
      <td>{{ data.type }}</td>
      <td>{{ data.qty }}</td>
      <td>{{ data.workstation?.name }}</td>
      <td>{{ data.equipment?.name }}</td>
      <td>{{ data.worker?.name }}</td>
    </template>
  </CfDataTable>
</template>