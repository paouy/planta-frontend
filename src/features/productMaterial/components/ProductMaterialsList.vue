<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'reference.categoryName',
    label: 'Category'
  }, {
    key: 'name',
    label: 'Name'
  }, {
    key: 'qty',
    label: 'Quantity'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    :row-actions="['Edit', 'Remove']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{data}">
      <td>{{ data.reference.categoryName }}</td>
      <td>{{ data.reference.name }}</td>
      <td>{{ `${data.qty} ${data.reference.uom}` }}</td>
    </template>
  </CfDataTable>
</template>