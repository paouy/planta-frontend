<script setup>
import { computed } from 'vue'
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])
const props = defineProps({
  data: Array,
  salesOrder: Object
})

const showQtyColumns = computed(() => {
  const statuses = ['CONFIRMED', 'PARTIALLY_FULFILLED', 'FULFILLED']
  return statuses.includes(props.salesOrder.status)
})
const computedColumns = computed(() => {
  const columns = [
    {
      label: '#',
      key: 'seq',
      width: '4rem'
    },{
      label: 'Product',
      key: 'product.normalizedName',
      width: props.salesOrder.status === 'OPEN' ? 'auto' : '40%'
    }, {
      label: 'Demand',
      key: 'qty'
    }
  ]

  if (showQtyColumns.value && !props.salesOrder.isArchived) {
    columns.push(
      {
        label: 'WIP',
        key: 'qtyWip'
      }, {
        label: 'Allocated',
        key: 'qtyAllocated'
      }
    )
  }

  if (showQtyColumns.value || props.salesOrder.isArchived) {
    columns.push({
      label: 'Fulfilled',
      key: 'qtyFulfilled'
    })
  }

  return columns
})

const data = computed(() => {
  return props.data.map((item, index) => {
    let actions = false

    if (props.salesOrder.status === 'OPEN') {
      actions = ['Edit', 'Remove']
    }

    if (['CONFIRMED', 'PARTIALLY_FULFILLED'].includes(props.salesOrder.status)) {
      actions = ['Make', 'Allocate']

      if (item.qtyAllocated) {
        actions.push('Fulfill')
      }
    }

    return {
      ...item,
      seq: index + 1,
      actions
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="computedColumns"
    :data="data"
    row-actions
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.seq }}</td>
      <td>{{ data.product.normalizedName }}</td>
      <td>{{ data.qty }} {{ data.product.uom }}</td>
      <td v-if="showQtyColumns && !props.salesOrder.isArchived">
        {{ data.qtyWip }} {{ data.product.uom }}
      </td>
      <td v-if="showQtyColumns && !props.salesOrder.isArchived">
        {{ data.qtyAllocated }} {{ data.product.uom }}
      </td>
      <td v-if="showQtyColumns || props.salesOrder.isArchived">
        {{ data.qtyFulfilled }} {{ data.product.uom }}
      </td>
    </template>
  </CfDataTable>
</template>