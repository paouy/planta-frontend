<script setup>
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'SKU',
    key: 'sku',
    width: '12.5%'
  }, {
    label: 'Name',
    key: 'name'
  }, {
    label: 'Category',
    key: 'category.name'
  }, {
    label: 'Available',
    key: 'qtyAvailable',
    width: '18.75%'
  }, {
    label: 'Allocated',
    key: 'qtyAllocated',
    width: '18.75%'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    searchable
    :row-actions="['Adjust', 'Edit', 'Remove']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.sku }}</td>
      <td>{{ data.name }}</td>
      <td>{{ data.category.name }}</td>
      <td>{{ `${data.qtyAvailable} ${data.uom}` }}</td>
      <td>{{ `${data.qtyAllocated} ${data.uom}` }}</td>
    </template>
  </CfDataTable>
</template>