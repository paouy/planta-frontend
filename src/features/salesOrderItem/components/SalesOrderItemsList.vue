<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components/index.js'

const emit = defineEmits(['action'])
const props = defineProps({
  data: Array,
  salesOrderStatus: String
})

const showAllColumns = computed(() => ['CONFIRMED', 'PARTIALLY_FULFILLED', 'FULFILLED'].includes(props.salesOrderStatus))
const computedColumns = computed(() => {
  const columns = [
    {
      label: '#',
      key: 'seq',
      width: '4rem'
    },{
      label: 'Product',
      key: 'product.normalizedName',
      width: props.salesOrderStatus === 'OPEN' ? 'auto' : '40%'
    }, {
      label: 'Demand',
      key: 'qty'
    }
  ]

  if (showAllColumns.value) {
    columns.push(
      {
        label: 'WIP',
        key: 'qtyWip'
      }, {
        label: 'Allocated',
        key: 'qtyAllocated'
      }, {
        label: 'Fulfilled',
        key: 'qtyFulfilled'
      }
    )
  }

  return columns
})

const data = computed(() => {
  return props.data.map((item, index) => {
    let actions = false

    if (props.salesOrderStatus === 'OPEN') {
      actions = ['Edit', 'Remove']
    }

    if (['CONFIRMED', 'PARTIALLY_FULFILLED'].includes(props.salesOrderStatus)) {
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
      <td v-if="showAllColumns">
        {{ data.qtyWip }} {{ data.product.uom }}
      </td>
      <td v-if="showAllColumns">
        {{ data.qtyAllocated }} {{ data.product.uom }}
      </td>
      <td v-if="showAllColumns">
        {{ data.qtyFulfilled }} {{ data.product.uom }}
      </td>
    </template>
  </CfDataTable>
</template>