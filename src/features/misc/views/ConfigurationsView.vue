<script setup>
import { ref } from 'vue'
import {
  CfAppView,
  CfHeader,
  CfActionCard,
  CfFilledButton
} from '../../../components/index.js'
import OperationsList from '../../operation/components/OperationsList.vue'

const columns = [
  {
    key: 'name',
    label: 'Name'
  }, {
    key: 'type',
    label: 'Type'
  }
]

const operations = [
  {
    id: 1,
    name: 'Corrugating',
    type: 'BATCH',
    position: 1
  }, {
    id: 2,
    name: 'Printing',
    type: 'JOB',
    position: 2,
    selectable: false
  }, {
    id: 3,
    name: 'Creasing',
    type: 'JOB',
    position: 3
  }
]

const lol = ref('')
const lel = ref([])
</script>

<template>
  <CfAppView>
    <CfHeader
      surtitle="Settings"
      title="Configurations"
    />
    <CfActionCard title="Production Operations">
      <template #body>
        Configure your production operations.
      </template>
      <template #action>
        <CfFilledButton to="/">Configure operations</CfFilledButton>
      </template>
    </CfActionCard>
    <OperationsList
      v-model:selection="lel"
      :columns="columns"
      :actions="['Edit', 'Remove']"
      :data="operations"
      sortable
      selectable
      searchable
      @action="data => lol = data"
    />
    <pre>{{ lel }}</pre>
  </CfAppView>
</template>