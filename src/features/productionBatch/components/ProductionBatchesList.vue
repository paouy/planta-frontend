<script setup>
import { CfDataTable, CfFilledButton } from '../../../components/index.js'

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
    key: 'qtyExpected'
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
    :item-actions="['Add record', 'View']"
    searchable
  >
    <template #action>
      <CfFilledButton>
        Add batch
      </CfFilledButton>
    </template>
  </CfDataTable>
</template>