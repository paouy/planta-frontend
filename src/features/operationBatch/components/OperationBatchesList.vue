<script setup>
import { computed } from 'vue'
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

const computedData = computed(() => {
  return props.data.map(batch => {
    let actions = ['Add report', 'View', 'Remove']

    if (batch.status === 'OPEN') {
      actions = ['Start', 'View', 'Remove']

      if (!batch.jobCount) {
        actions = ['Remove']
      }
    }

    if (batch.status === 'CLOSED') {
      actions = ['Archive']
    }

    return {
      ...batch,
      actions
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="computedData"
    searchable
    item-actions
    force-item-actions-menu
    @item-action="$event => emit('action', $event)"
  >
    <template #action>
      <CfFilledButton @click="emit('action', { action: 'CREATE' })">
        Add batch
      </CfFilledButton>
    </template>
  </CfDataTable>
</template>