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
    key: 'productionOrder.friendlyId'
  }, {
    label: 'Product',
    key: 'product.name'
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
  return props.data.map(productionJob => {
    let actions = ['Add record', 'Close', 'Edit']

    if (productionJob.status === 'OPEN') {
      actions = ['Add record', 'Edit']
    }

    if (productionJob.status === 'CLOSED') {
      actions = ['Add record', null]
    }

    const { output, reject, rework, adjustment } = productionJob.operation.summary
    const qty = `${output + reject + rework + adjustment}/${productionJob.qtyExpected}`

    return {
      ...productionJob,
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
    :item-actions="['Add record', 'Close', 'Edit']"
    searchable
    @item-action="$event => emit('action', $event)"
  />
</template>