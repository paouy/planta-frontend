<script setup>
import { computed } from 'vue'
import { CfDataTable } from 'vue-cf-ui'
import StatusBadge from '../../../components/StatusBadge.vue'

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
    key: 'productionOrder.publicId'
  }, {
    label: 'Product',
    key: 'product.normalizedName',
    width: '25%'
  }, {
    label: 'Quantity',
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
    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
    const qty = `${qtyMade.toLocaleString()}/${job.qtyInput.toLocaleString()}`

    let actions = false

    if (job.status === 'OPEN' || job.status === 'PAUSED') {
      actions = ['Add record', 'Reassign']
    }

    if (job.status === 'IN_PROGRESS') {
      actions = ['Add record', 'Reassign']

      if (job.isAllowedShortfall) {
        actions.push('Close')
      }
    }

    if (job.status === 'CLOSED') {
      actions = ['Add record']
    }

    if (job.operationBatchId || job.isLocked) {
      actions = false
    }

    return {
      _: { actions },
      ...job,
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
  >
    <template v-slot:row="{ data }">
      <td>{{ data.productionOrder.publicId }}</td>
      <td>{{ data.product.normalizedName }}</td>
      <td>{{ data.qty }}</td>
      <td>{{ data.timeEstimatedMins }}</td>
      <td><StatusBadge :data="data.status"/></td>
      <td>{{ data.workstation?.name }}</td>
    </template>
  </CfDataTable>
</template>