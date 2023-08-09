<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components/index.js'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: '#',
    key: 'seq',
    width: '3.5rem'
  }, {
    label: 'ID',
    key: 'publicId'
  }, {
    label: 'Status',
    key: 'status'
  }, {
    label: 'Product',
    key: 'product.normalizedName',
    width: '27.5%'
  }, {
    label: 'Demand',
    key: 'qty'
  }, {
    label: 'Made',
    key: 'qtyProduced'
  }, {
    label: 'Due date',
    key: 'dueDate'
  }
]

const computedData = computed(() => {
  const isNotAlone = props.data.length > 1

  return props.data.map(order => {
    const actions = [{
      name: 'View',
      to: {
        name: 'ProductionOrder',
        params: {
          productionOrderId: order.id
        }
      }
    }]

    if (isNotAlone && order.status !== 'CLOSED') {
      actions.push('Reprioritize')
    }

    if (order.status === 'OPEN') {
      actions.push('Delete')
    }

    if (order.status === 'CLOSED') {
      actions.push('Release')
    }

    return {
      ...order,
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
    sortable
    default-sort-key="seq"
    row-actions
    force-row-menu
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.seq }}</td>
      <td>{{ data.publicId }}</td>
      <td>{{ data.status }}</td>
      <td>{{ data.product.normalizedName }}</td>
      <td>{{ `${data.qty} ${data.product.uom}` }}</td>
      <td>{{ `${data.qtyProduced} ${data.product.uom}` }}</td>
      <td>{{ data.dueDate }}</td>
    </template>
  </CfDataTable>
</template>