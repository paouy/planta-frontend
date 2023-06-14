<script setup>
import { CfDataTable, CfFilledButton } from '../../../components'

const emit = defineEmits(['add', 'remove', 'edit'])

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

const onAction = ({ action, item }) => {
  emit(action.toLowerCase(), item)
}
</script>

<template>
  <CfDataTable
    title="Workstations"
    description="Configure your workstations."
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