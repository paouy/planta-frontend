<script setup>
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])
const props = defineProps({ data: Array })
const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'publicId',
    label: 'ID'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    sortable
    :row-actions="['Edit', 'Remove']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ `${data.lastName}, ${data.firstName}` }}</td>
      <td>{{ data.publicId }}</td>
    </template>
  </CfDataTable>
</template>