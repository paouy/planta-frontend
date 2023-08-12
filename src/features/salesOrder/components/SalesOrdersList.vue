<script setup>
import { CfDataTable } from '../../../components'

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
  />
</template>