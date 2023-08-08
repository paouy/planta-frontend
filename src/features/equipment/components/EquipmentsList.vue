<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Name',
    key: 'name'
  }, {
    label: 'Operations',
    key: 'operationCount'
  }
]

const computedData = computed(() => {
  return props.data.map(equipment => ({
    ...equipment,
    operationCount: equipment.operationIds.length
  }))
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="computedData"
    :row-actions="['Edit', 'Remove']"
    @row-action="$event => emit('action', $event)"
  />
</template>