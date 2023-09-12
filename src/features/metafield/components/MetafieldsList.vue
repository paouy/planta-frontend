<script setup>
import { computed } from 'vue'
import { useOperationStore } from '../../operation/index.js'
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])
const props = defineProps({ data: Array })

const columns = computed(() => {
  if (props.data.some(metafield => metafield.resource !== 'PRODUCT')) {
    return [
      {
        key: 'name',
        label: 'Name'
      }, {
        key: 'operationName',
        label: 'Operation'
      }, {
        key: 'type',
        label: 'Type'
      }
    ]
  } else {
    return [
      {
        key: 'name',
        label: 'Name'
      }, {
        key: 'type',
        label: 'Type'
      }
    ]
  }
})

const data = computed(() => {
  const { operations } = useOperationStore()

  return props.data.map((metafield, index) => {
    let operationName

    if (metafield.resource !== 'PRODUCT') {
      const operationId = metafield.resource.slice(10)
      const { name } = operations.value.find(({ id }) => operationId === id)
      
      operationName = name
    }

    let actions = ['Move up', 'Move down', 'Edit', 'Remove']

    if (props.data.length > 1 && index === 0) {
      actions = ['Move down', 'Edit', 'Remove']
    }
    
    if (props.data.length > 1 && index === props.data.length - 1) {
      actions = ['Move up', 'Edit', 'Remove']
    }
    
    if (props.data.length === 1) {
      actions = ['Edit', 'Remove']
    }

    return {
      _: { actions },
      ...metafield,
      operationName
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="data"
    row-actions
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.name }}</td>
      <td v-if="data.operationName">{{ data.operationName }}</td>
      <td class="capitalize">{{ data.type }}</td>
    </template>
  </CfDataTable>
</template>