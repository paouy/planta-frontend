<script setup>
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'operationName',
    label: 'Operation'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :item-actions="['Edit', 'Remove']"
    :data="props.data"
    @item-action="$event => emit('action', $event)"
  />
</template>