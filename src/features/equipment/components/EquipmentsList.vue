<script setup>
import { CfDataTable, CfFilledButton } from '../../../components'

const emit = defineEmits(['add', 'remove', 'edit'])

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

const onAction = ({ action, item }) => {
  emit(action.toLowerCase(), item)
}
</script>

<template>
  <CfDataTable
    title="Equipment"
    description="Configure your equipment."
    :columns="columns"
    :item-actions="['Edit', 'Remove']"
    :data="props.data"
    custom-template
    @action="onAction"
  >
    <template #action>
      <CfFilledButton @click="emit('add')">
        Add equipment
      </CfFilledButton>
    </template>
    <template v-slot="{ item }">
      <td>{{ item.name }}</td>
      <td>{{ item.operations.map(({ name }) => name).join(', ') }}</td>
    </template>
  </CfDataTable>
</template>