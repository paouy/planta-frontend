<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'material.categoryName',
    label: 'Category'
  }, {
    key: 'material.normalizedName',
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
      <td>{{ data.material.categoryName }}</td>
      <td>{{ data.material.normalizedName }}</td>
      <td>{{ `${data.qty} ${data.material.uom}` }}</td>
    </template>
  </CfDataTable>
</template>