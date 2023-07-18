<script setup>
import { CfDataTable, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['action'])

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const columns = [
  {
    label: 'ID',
    key: 'friendlyId',
    width: '12%'
  }, {
    label: 'Schedule',
    key: 'schedule'
  }, {
    label: 'Job Count',
    key: 'jobCount'
  }, {
    label: 'Status',
    key: 'status'
  }, {
    label: 'Workstation',
    key: 'workstation.name'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    searchable
    :item-actions="['Add report', 'View', 'Remove']"
    @item-action="$event => emit('action', $event)"
  >
    <template #action>
      <CfFilledButton @click="emit('action', { action: 'CREATE' })">
        Add batch
      </CfFilledButton>
    </template>
  </CfDataTable>
</template>