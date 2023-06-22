<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'normalizedOperations',
    label: 'Operations'
  }
]

const computedData = computed(() => {
  return props.data.map(equipment => ({
    ...equipment,
    normalizedOperations: equipment.operations.map(({ name }) => name).join(', ')
  }))
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="computedData"
    :item-actions="['Edit', 'Remove']"
    @item-action="$event => emit('action', $event)"
  />
</template>