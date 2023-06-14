<script setup>
import { CfDataTable, CfFilledButton } from '../../../components'

const emit = defineEmits(['add', 'remove'])

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

const onAction = ({ action, item }) => {
  emit(action.toLowerCase(), item)
}
</script>

<template>
  <CfDataTable
    title="Production Operations"
    description="Configure your production operations."
    :columns="columns"
    :item-actions="['Edit', 'Remove']"
    :data="props.data"
    @action="onAction"
  >
    <template #action>
      <CfFilledButton @click="emit('add')">
        Add operation
      </CfFilledButton>
    </template>
  </CfDataTable>
</template>