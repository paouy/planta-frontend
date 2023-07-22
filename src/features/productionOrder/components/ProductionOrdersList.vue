<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components/index.js'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: '#',
    key: 'seq',
    width: '4rem'
  }, {
    label: 'ID',
    key: 'friendlyId',
    width: '12%'
  }, {
    label: 'Product',
    key: 'product.name'
  }, {
    label: 'Expected',
    key: 'qty'
  }, {
    label: 'Produced',
    key: 'qtyProduced'
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

  return props.data.map((order, index) => {
    const positionActions = []
    const actions = ['View']

    if (isNotAlone) {
      if (index > 0) {
        positionActions.push('Move up')
      }
      
      if (index < props.data.length - 1) {
        positionActions.push('Move down')
      }
    }

    if (order.status === 'OPEN') {
      actions.push('Remove')
    }

    if (order.status === 'CLOSED') {
      actions.push('Archive')
    }

    return {
      ...order,
      actions: [...actions, ...positionActions]
    }
  })
})
</script>

<template>
  <CfDataTable
    custom-template
    searchable
    sortable
    default-sort-key="seq"
    :columns="columns"
    :data="computedData"
    :item-actions="['View', 'Move up', 'Move down']"
    @item-action="$event => emit('action', $event)"
  >
    <template v-slot="{item}">
      <td>{{ item.seq }}</td>
      <td>{{ item.friendlyId }}</td>
      <td>{{ item.product.name }}</td>
      <td>{{ `${item.qty} ${item.product.uom}` }}</td>
      <td>{{ `${item.qtyProduced} ${item.product.uom}` }}</td>
      <td>{{ item.status }}</td>
      <td>{{ item.dueDate }}</td>
    </template>
  </CfDataTable>
</template>