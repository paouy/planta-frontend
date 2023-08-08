<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components/index.js'

const emit = defineEmits(['action'])

const props = defineProps({
  data: Array,
  updateOnly: Boolean
})

const computedColumns = computed(() => {
  const columns = [
    {
      label: '#',
      key: 'seq',
      width: '4rem'
    },{
      label: 'Name',
      key: 'product.normalizedName',
      width: props.updateOnly ? 'auto' : '40%'
    }, {
      label: 'Demand',
      key: 'qty'
    }
  ]

  if (!props.updateOnly) {
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
    const actions = !props.updateOnly
      ? ['Make', 'Allocate']
      : ['Edit', 'Remove']

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
      <td v-if="!props.updateOnly">{{ data.qtyWip }} {{ data.product.uom }}</td>
      <td v-if="!props.updateOnly">{{ data.qtyAllocated }} {{ data.product.uom }}</td>
      <td v-if="!props.updateOnly">{{ data.qtyFulfilled }} {{ data.product.uom }}</td>
    </template>
  </CfDataTable>
</template>