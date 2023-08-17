<script setup>
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])
const props = defineProps({ data: Array })
const columns = [{ key: 'name', label: 'Name' }]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    searchable
    :row-actions="['Edit', 'Delete']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.name }} ({{ data.shortName }})</td>
    </template>
  </CfDataTable>
</template>