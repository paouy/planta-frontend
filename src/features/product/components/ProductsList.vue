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
    width: '12.5%'
  }, {
    label: 'WIP',
    key: 'qtyWip',
    width: '12.5%'
  }, {
    label: 'Allocated',
    key: 'qtyAllocated',
    width: '12.5%'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    searchable
    :row-actions="['Make', 'Adjust', 'View']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{data}">
      <td>{{ data.sku }}</td>
      <td>{{ data.name }}</td>
      <td>{{ data.category.name }}</td>
      <td>{{ `${data.qtyAvailable} ${data.uom}` }}</td>
      <td>{{ `${data.qtyWip} ${data.uom}` }}</td>
      <td>{{ `${data.qtyAllocated} ${data.uom}` }}</td>
    </template>
  </CfDataTable>
</template>