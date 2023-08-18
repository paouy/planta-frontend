<script setup>
import { computed } from 'vue'
import { CfDataTable } from 'vue-cf-ui'
import StatusBadge from '../../../components/StatusBadge.vue'

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
    label: 'Product',
    key: 'product.normalizedName',
    width: '35%'
  }, {
    label: 'Quantity',
    key: 'normalizedQty'
  }, {
    label: 'Status',
    key: 'status'
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

    // if (order.status === 'IN_PROGRESS') {
    //   actions.push('Pause')
    // }

    // if (order.status === 'PAUSED') {
    //   actions.push('Resume')
    // }

    const normalizedQty = order.status === 'CLOSED'
      ? `${order.qtyMade}/${order.qty}`
      : order.qty

    return {
      _: { actions },
      ...order,
      normalizedQty
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
      <td>{{ data.product.normalizedName }}</td>
      <td>{{ data.normalizedQty }}</td>
      <td><StatusBadge :data="data.status"/></td>
      <td>{{ data.dueDate }}</td>
    </template>
  </CfDataTable>
</template>