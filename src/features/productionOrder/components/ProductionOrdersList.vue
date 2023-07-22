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
    const commonActions = ['View']
    const priorityActions = []

    if (isNotAlone) {
      if (index > 0) {
        priorityActions.push('Move up')
      }
      
      if (index < props.data.length - 1) {
        priorityActions.push('Move down')
      }
    }

    if (order.status === 'OPEN') {
      commonActions.push('Remove')
    }

    if (order.status === 'CLOSED') {
      commonActions.push('Archive')
    }

    return {
      ...order,
      actions: [...commonActions, ...priorityActions]
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
    item-actions
    force-item-actions-menu
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