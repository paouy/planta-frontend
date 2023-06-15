<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'operations',
    label: 'Operations'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :item-actions="['Edit', 'Remove']"
    :data="props.data"
    custom-template
    @item-action="$event => emit('action', $event)"
  >
    <template v-slot="{ item }">
      <td>{{ item.name }}</td>
      <td>{{ item.operations.map(({ name }) => name).join(', ') }}</td>
    </template>
  </CfDataTable>
</template>