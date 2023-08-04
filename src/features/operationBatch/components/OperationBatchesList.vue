<script setup>
import { computed } from 'vue'
import { CfDataTable, CfOutlinedButton } from '../../../components/index.js'

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
    let actions = ['Start', 'Remove']
    
    if (!batch.jobCount) {
      actions = ['Remove']
    }

    if (batch.status === 'IN_PROGRESS') {
      actions = ['Add report']
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
    force-row-menu
    row-actions
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:header>
      <CfOutlinedButton @click="emit('action', { key: 'CREATE' })">
        Add batch
      </CfOutlinedButton>
    </template>
  </CfDataTable>
</template>