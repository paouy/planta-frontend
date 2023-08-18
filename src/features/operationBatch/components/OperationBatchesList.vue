<script setup>
import { computed } from 'vue'
import { CfDataTable, CfOutlinedButton } from 'vue-cf-ui'
import StatusBadge from '../../../components/StatusBadge.vue'

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
    key: 'publicId',
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
      _: { actions },
      ...batch
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
    <template v-slot:row="{ data }">
      <td>{{ data.publicId }}</td>
      <td>{{ data.schedule }}</td>
      <td>{{ data.jobCount }}</td>
      <td><StatusBadge :data="data.status"/></td>
      <td>{{ data.workstation.name }}</td>
    </template>
  </CfDataTable>
</template>