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
    label: 'Date',
    key: 'date'
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