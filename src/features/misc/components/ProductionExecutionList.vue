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
    key: 'productionOrder.publicId',
    width: '12%'
  }, {
    label: 'Product',
    key: 'product.normalizedName'
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
  return props.data.map((job, index) => {
    let actions = false

    if (job.status === 'OPEN') {
      actions = ['Add record', 'Reassign']
    }

    if (job.status === 'IN_PROGRESS') {
      actions = ['Add record', 'Reassign', 'Close']
    }

    if (job.status === 'CLOSED' && !job.isLocked) {
      actions = ['Add record']
    }

    if (job.operation.batch) {
      actions = false
    }

    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework

    const qty = `${qtyMade.toLocaleString()}/${job.qtyInput.toLocaleString()}`

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
    force-row-menu
    row-actions
    @row-action="$event => emit('action', $event)"
  />
</template>