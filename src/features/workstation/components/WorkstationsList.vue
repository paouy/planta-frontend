<script setup>
import { ref } from 'vue'
import { CfDataTable, CfFilledButton } from '../../../components'

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'operationName',
    label: 'Operation'
  }
]

const data = ref([
  {
    id: 1,
    name: 'Corrugating 1',
    operationName: 'Corrugating'
  }, {
    id: 2,
    name: 'Printing 1',
    operationName: 'Printing'
  }, {
    id: 3,
    name: 'Creasing 1',
    operationName: 'Creasing'
  }
])
</script>

<template>
  <CfDataTable
    title="Workstations"
    description="Configure your workstations."
    :columns="columns"
    :item-actions="['Edit', 'Remove']"
    :data="data"
    @action="data => lol = data"
  >
    <template #action>
      <CfFilledButton>Add workstation</CfFilledButton>
    </template>
  </CfDataTable>
</template>