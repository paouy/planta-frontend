<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'friendlyId',
    label: 'ID',
    width: '12%'
  }, {
    key: 'product.name',
    label: 'Product'
  }, {
    key: 'qty',
    label: 'Qty'
  }, {
    key: 'status',
    label: 'Status'
  }, {
    key: 'dueDate',
    label: 'Due date'
  }
]
</script>

<template>
  <CfDataTable
    custom-template
    searchable
    :columns="columns"
    :data="props.data"
    :item-actions="['View', 'Move up', 'Move down']"
    @item-action="$event => emit('action', $event)"
  >
    <template v-slot="{item}">
      <td>{{ item.friendlyId }}</td>
      <td>{{ item.product.name }}</td>
      <td>{{ `${item.qty} ${item.product.uom}` }}</td>
      <td>{{ item.status }}</td>
      <td>{{ item.dueDate }}</td>
    </template>
  </CfDataTable>
</template>