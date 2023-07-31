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
    :columns="columns"
    :data="props.data"
    searchable
    :row-actions="['Make', 'Adjust', 'View']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{data}">
      <td>{{ data.normalizedName }}</td>
      <td>{{ data.collection.name }}</td>
      <td>{{ `${data.qtyAvailable} ${data.uom}` }}</td>
      <td>{{ `${data.qtyCommitted} ${data.uom}` }}</td>
      <td>{{ `${data.qtyExpected} ${data.uom}` }}</td>
    </template>
  </CfDataTable>
</template>