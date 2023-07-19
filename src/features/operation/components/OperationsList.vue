<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components'

const emit = defineEmits(['action'])

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Name',
    key: 'normalizedName'
  }, {
    label: 'Cycle Time',
    key: 'timePerCycleMins'
  }, {
    label: 'Allows Rework',
    key: 'normalizedAllowsRework'
  }
]

const computedData = computed(() => {
  return props.data.map((operation, index) => {
    const normalizedName = `${operation.name} ${operation.isBatch ? '(Batch)' : ''}`
    const normalizedAllowsRework = operation.allowsRework ? 'Yes' : 'No'
    let actions = ['Move up', 'Move down', 'Edit', 'Remove']

    if (index === 0) {
      actions = ['Move down', 'Edit', 'Remove']
    }

    if (index === props.data.length - 1) {
      actions = ['Move up', 'Edit', 'Remove']
    }

    return {
      ...operation,
      normalizedName,
      normalizedAllowsRework,
      actions
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    item-actions
    force-item-action-menu
    :data="computedData"
    @item-action="$event => emit('action', $event)"
  />
</template>