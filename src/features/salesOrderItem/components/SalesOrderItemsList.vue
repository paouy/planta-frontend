<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components/index.js'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Name',
    key: 'product.normalizedName',
    width: '40%'
  }, {
    label: 'Demand',
    key: 'qty'
  }, {
    label: 'WIP',
    key: 'qtyWip'
  }, {
    label: 'Allocated',
    key: 'qtyAllocated'
  }
]

const data = computed(() => {
  return props.data.map(item => {
    const actions = ['Make', 'Allocate']

    return {
      ...item,
      actions
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="data"
    row-actions
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.product.normalizedName }}</td>
      <td>{{ data.qty }} {{ data.product.uom }}</td>
      <td>{{ data.qtyWip }} {{ data.product.uom }}</td>
      <td>{{ data.qtyAllocated }} {{ data.product.uom }}</td>
    </template>
  </CfDataTable>
</template>