<script setup>
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'type',
    label: 'Type'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    :row-actions="['Edit', 'Remove']"
    @row-action="$event => emit('action', $event)"
  />
</template>