<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'collection.name',
    label: 'Collection'
  }, {
    key: 'qtyAvailable',
    label: 'Available'
  }, {
    key: 'qtyAllocated',
    label: 'Allocated'
  }
]
</script>

<template>
  <CfDataTable
    custom-template
    searchable
    :columns="columns"
    :data="props.data"
    :item-actions="['Adjust', 'Edit', 'Remove']"
    @item-action="$event => emit('action', $event)"
  >
    <template v-slot="{item}">
      <td>{{ item.name }}</td>
      <td>{{ item.collection.name }}</td>
      <td>{{ `${item.qtyAvailable} ${item.uom}` }}</td>
      <td>{{ `${item.qtyAllocated} ${item.uom}` }}</td>
    </template>
  </CfDataTable>
</template>