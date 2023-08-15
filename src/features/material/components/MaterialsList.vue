<script setup>
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'normalizedName',
    label: 'Name'
  }, {
    key: 'category.name',
    label: 'Category'
  }, {
    key: 'qtyAvailable',
    label: 'Available'
  }, {
    key: 'qtyAllocated',
    label: 'Allocated'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    searchable
    :row-actions="['Adjust', 'Edit', 'Remove']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.normalizedName }}</td>
      <td>{{ data.category.name }}</td>
      <td>{{ `${data.qtyAvailable} ${data.uom}` }}</td>
      <td>{{ `${data.qtyAllocated} ${data.uom}` }}</td>
    </template>
  </CfDataTable>
</template>