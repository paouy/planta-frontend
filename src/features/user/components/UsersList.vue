<script setup>
import { computed } from 'vue'
import { CfDataTable } from 'vue-cf-ui'
import { useAuth } from '../../auth/index.js'

const emit = defineEmits(['action'])
const props = defineProps({ data: Array })
const columns = [
  {
    label: 'Name',
    key: 'lastName'
  }, {
    label: 'Administrator',
    key: 'isAdmin'
  }, {
    label: 'Last Login',
    key: 'lastLogin'
  }
]

const { session } = useAuth()

const data = computed(() => {
  return props.data.map(user => {
    const actions = ['Update', 'Change password']

    if (user.id !== session.value?.user.id) {
      actions.push('Delete')
    }

    const normalizedLastLogin = user.lastLogin
      ? new Date(user.lastLogin).toLocaleString('en-CA')
      : ''

    return {
      _: { actions },
      ...user,
      normalizedLastLogin
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="data"
    row-actions
    force-row-menu
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ `${data.lastName}, ${data.firstName} ${data.isDisabled ? '(Disabled)' : ''}` }}</td>
      <td>{{ data.isAdmin ? 'Yes' : '' }}</td>
      <td>{{ data.normalizedLastLogin }}</td>
    </template>
  </CfDataTable>
</template>