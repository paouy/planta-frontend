<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'ID',
    key: 'friendlyId'
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
    searchable
    :columns="columns"
    :data="props.data"
    :item-actions="['View']"
    @item-action="$event => emit('action', $event)"
  />
</template>