<script setup>
import { CfDataTable } from 'vue-cf-ui'
import StatusBadge from '../../../components/StatusBadge.vue'

const emit = defineEmits(['action'])
const props = defineProps({ data: Array })
const columns = [
  {
    label: 'ID',
    key: 'publicId'
  }, {
    label: 'Customer',
    key: 'customer.shortName'
  }, {
    label: 'Item Count',
    key: 'itemCount'
  }, {
    label: 'Date',
    key: 'date'
  }, {
    label: 'Status',
    key: 'status'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    searchable
    :row-actions="['View']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.publicId }}</td>
      <td>{{ data.customer.shortName }}</td>
      <td>{{ data.itemCount }}</td>
      <td>{{ data.date }}</td>
      <td><StatusBadge :data="data.status"/></td>
    </template>
  </CfDataTable>
</template>