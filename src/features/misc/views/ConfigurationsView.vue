<script setup>
import { ref, onMounted } from 'vue'
import { getOperations } from '../../operation/api/index.js'
import { getWorkstations } from '../../workstation/api/index.js'
import { CfAppView, CfHeader } from '../../../components/index.js'

import OperationsList from '../../operation/components/OperationsList.vue'
import AddOperation from '../../operation/components/AddOperation.vue'
import RemoveOperation from '../../operation/components/RemoveOperation.vue'
import UpdateOperation from '../../operation/components/UpdateOperation.vue'

import WorkstationsList from '../../workstation/components/WorkstationsList.vue'
import AddWorkstation from '../../workstation/components/AddWorkstation.vue'
import RemoveWorkstation from '../../workstation/components/RemoveWorkstation.vue'

const operations = ref([])
const operation = ref(null)
const showAddOperation = ref(false)
const showRemoveOperation = ref(false)
const showUpdateOperation = ref(false)

const onOperationsListRemove = (data) => {
  operation.value = data
  showRemoveOperation.value = true
}

const onOperationsListUpdate = (data) => {
  operation.value = data
  showUpdateOperation.value = true
}

const onAddOperation = (operation) => {
  operations.value = [...operations.value, operation]
    .sort((a, b) => a.position - b.position)
}

const onRemoveOperation = (operationIndex) => {
  operations.value.splice(operationIndex, 1)
}

const onUpdateOperation = (operation) => {
  const operationIndex = operations.value
    .findIndex(({ id }) => id === operation.id)

  operations.value[operationIndex] = operation

  operations.value = operations.value
    .sort((a, b) => a.position - b.position)
}

const workstations = ref([])
const workstation = ref(null)
const showAddWorkstation = ref(false)
const showRemoveWorkstation = ref(false)

const onWorkstaionsListRemove = (data) => {
  workstation.value = data
  showRemoveWorkstation.value = true
}

const onAddWorkstation = (workstation) => {
  workstations.value.push(workstation)
}

const onRemoveWorkstation = (workstationIndex) => {
  workstations.value.splice(workstationIndex, 1)
}

onMounted(async () => {
  const [
    operationsFromApi,
    workstationsFromApi
  ] = await Promise.all([
    getOperations(),
    getWorkstations()
  ])

  operations.value = operationsFromApi
  workstations.value = workstationsFromApi
})
</script>

<template>
  <CfAppView>
    <CfHeader
      surtitle="Settings"
      title="Configurations"
    />
    <OperationsList
      :data="operations"
      @add="showAddOperation = true"
      @remove="onOperationsListRemove"
      @edit="onOperationsListUpdate"
    />
    <AddOperation
      @success="onAddOperation"
      @cancel="showAddOperation = false"
      v-if="showAddOperation"
    />
    <RemoveOperation
      :data="operation"
      @success="onRemoveOperation"
      @cancel="showRemoveOperation = false, operation = null"
      v-if="showRemoveOperation"
    />
    <UpdateOperation
      :data="operation"
      @success="onUpdateOperation"
      @cancel="showUpdateOperation = false, operation = null"
      v-if="showUpdateOperation"
    />

    <WorkstationsList
      :data="workstations"
      @add="showAddWorkstation = true"
      @remove="onWorkstaionsListRemove"
    />
    <AddWorkstation
      @success="onAddWorkstation"
      @cancel="showAddWorkstation = false"
      v-if="showAddWorkstation"
    />
    <RemoveWorkstation
      :data="workstation"
      @success="onRemoveWorkstation"
      @cancel="showRemoveWorkstation = false, operation = null"
      v-if="showRemoveWorkstation"
    />
  </CfAppView>

  
</template>