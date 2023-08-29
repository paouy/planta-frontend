<script setup>
import { computed } from 'vue'
import { useOperationStore } from '../../operation/index.js'
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])
const props = defineProps({ data: Array })
const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'resource',
    label: 'Resource'
  }, {
    key: 'type',
    label: 'Type'
  }
]

const data = computed(() => {
  const { operations } = useOperationStore()

  return props.data.map(metafield => {
    let normalizedResource = 'Product'

    if (metafield.resource !== 'PRODUCT') {
      const operationId = metafield.resource.slice(10)
      const { name } = operations.value.find(({ id }) => operationId === id)
      
      normalizedResource = `Operation (${name})`
    }

    return {
      ...metafield,
      normalizedResource
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="data"
    :row-actions="['Edit', 'Remove']"
    @row-action="$event => emit('action', $event)"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.name }}</td>
      <td>{{ data.normalizedResource }}</td>
      <td>{{ data.type.toLowerCase() }}</td>
    </template>
  </CfDataTable>
</template>