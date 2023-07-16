<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: '#',
    key: 'seq',
    width: '4rem'
  }, {
    label: 'ID',
    key: 'friendlyId',
    width: '12%'
  }, {
    label: 'Product',
    key: 'product.name'
  }, {
    label: 'Qty',
    key: 'qty'
  }, {
    label: 'Status',
    key: 'status'
  }, {
    label: 'Due date',
    key: 'dueDate'
  }
]
</script>

<template>
  <CfDataTable
    custom-template
    searchable
    sortable
    default-sort-key="seq"
    :columns="columns"
    :data="props.data"
    :item-actions="['View', 'Move up', 'Move down']"
    @item-action="$event => emit('action', $event)"
  >
    <template v-slot="{item}">
      <td>{{ item.seq }}</td>
      <td>{{ item.friendlyId }}</td>
      <td>{{ item.product.name }}</td>
      <td>{{ `${item.qty} ${item.product.uom}` }}</td>
      <td>{{ item.status }}</td>
      <td>{{ item.dueDate }}</td>
    </template>
  </CfDataTable>
</template>