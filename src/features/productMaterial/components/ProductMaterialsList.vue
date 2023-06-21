<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'collectionName',
    label: 'Collection'
  }, {
    key: 'name',
    label: 'Name'
  }, {
    key: 'qty',
    label: 'Quantity'
  }
]
</script>

<template>
  <CfDataTable
    custom-template
    :columns="columns"
    :data="props.data"
    :item-actions="['Edit', 'Remove']"
    @item-action="$event => emit('action', $event)"
  >
    <template v-slot="{item}">
      <td>{{ item.name }}</td>
      <td>{{ item.collectionName }}</td>
      <td>{{ `${item.qty} ${item.uom}` }}</td>
    </template>
  </CfDataTable>
</template>