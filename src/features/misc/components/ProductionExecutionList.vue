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
    label: 'Job',
    key: 'normalizedJob',
    width: '35%'
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
    const normalizedJob = `${job.productionOrder.publicId} — ${job.product.normalizedName}`
    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
    const qty = `${qtyMade.toLocaleString()}/${job.qtyInput.toLocaleString()}`

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

    if (job.operationBatchId) {
      actions = false
    }

    return {
      ...job,
      normalizedJob,
      qty,
      actions
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