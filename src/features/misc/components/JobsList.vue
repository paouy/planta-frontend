<script setup>
import { computed } from 'vue'
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
    key: 'productionOrder.friendlyId',
    width: '12%'
  }, {
    label: 'Product',
    key: 'productName'
  }, {
    label: 'Qty',
    key: 'qty'
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

const computedData = computed(() => {
  return props.data.map(job => {
    let actions = ['Add record', 'Edit', 'Close']

    if (job.status === 'OPEN') {
      actions = ['Add record', 'Edit']
    }

    if (job.status === 'CLOSED') {
      actions = ['Add record']
    }

    const qty = `${job.qtyProduced.toLocaleString()}/${job.qtyExpected.toLocaleString()}`

    return {
      ...job,
      actions,
      qty
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="computedData"
    searchable
    item-actions
    force-item-actions-menu
    @item-action="$event => emit('action', $event)"
  />
</template>