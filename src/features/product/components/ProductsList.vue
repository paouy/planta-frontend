<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'normalizedName',
    label: 'Name'
  }, {
    key: 'collection.name',
    label: 'Collection'
  }, {
    key: 'qtyAvailable',
    label: 'Available'
  }, {
    key: 'qtyCommitted',
    label: 'Committed'
  }, {
    key: 'qtyExpected',
    label: 'Expected'
  }
]
</script>

<template>
  <CfDataTable
    custom-template
    searchable
    :columns="columns"
    :data="props.data"
    :item-actions="['Make', 'Adjust', 'View']"
    @item-action="$event => emit('action', $event)"
  >
    <template v-slot="{item}">
      <td>{{ item.normalizedName }}</td>
      <td>{{ item.collection.name }}</td>
      <td>{{ `${item.qtyAvailable} ${item.uom}` }}</td>
      <td>{{ `${item.qtyCommitted} ${item.uom}` }}</td>
      <td>{{ `${item.qtyExpected} ${item.uom}` }}</td>
    </template>
  </CfDataTable>
</template>