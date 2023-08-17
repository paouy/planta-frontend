<script setup>
import { CfDataTable } from 'vue-cf-ui'
import StatusBadge from '../../../components/StatusBadge.vue'

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
  >
  <template v-slot:row="{ data }">
    <td>{{ data.operation.name }}</td>
    <td><StatusBadge :data="data.status"/></td>
    <td>{{ data.qtyOutput }}</td>
    <td>{{ data.qtyReject ? `(${data.qtyReject})` : 0  }}</td>
    <td>{{ data.qtyRework }}</td>
    <td>{{ data.qtyShortfall ? `(${data.qtyShortfall})` : 0 }}</td>
  </template>
  </CfDataTable>
</template>