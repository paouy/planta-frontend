<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'shortName',
    label: 'Short name'
  }
]
</script>

<template>
  <CfDataTable
    searchable
    :columns="columns"
    :data="props.data"
    :item-actions="['Edit', 'Delete']"
    @item-action="$event => emit('action', $event)"
  />
</template>