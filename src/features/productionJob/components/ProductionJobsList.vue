<script setup>
import { CfDataTable } from '../../../components/index.js'

const emit = defineEmits(['action'])

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const columns = [
  {
    label: 'ID',
    key: 'productionOrder.friendlyId'
  }, {
    label: 'Product',
    key: 'product.name'
  }, {
    label: 'Qty',
    key: 'qtyExpected'
  }, {
    label: 'Est Time',
    key: 'timeEstimatedMins'
  }, {
    label: 'Status',
    key: 'status'
  }, {
    label: 'Workstation',
    key: 'workstation.name'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    :item-actions="['Add record', 'Edit']"
    searchable
    @item-action="$event => emit('action', $event)"
  />
</template>