<script setup>
import { CfDataTable } from '../../../components/index'

const props = defineProps({ data: Array })
const columns = [
  {
    label: 'ID',
    key: 'publicId'
  }, {
    label: 'Quantity',
    key: 'qty'
  }, {
    label: 'Status',
    key: 'status'
  }, {
    label: 'Due Date',
    key: 'dueDate'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.publicId }}</td>
      <td>{{ data.qty }} {{ data.product.uom }}</td>
      <td>{{ data.status }}</td>
      <td>{{ data.dueDate }}</td>
    </template>
  </CfDataTable>
</template>