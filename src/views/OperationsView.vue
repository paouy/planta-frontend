<script setup>
import { ref } from 'vue'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { useStore } from '../features/misc/index.js'
import { useOperationStore, CreateOperation, DeleteOperation, OperationsList, UpdateOperation } from '../features/operation/index.js'
import api from '../api/index.js'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Operations'
  }
]

const { isInitialized, isInitializing } = useStore()
const { operations, ...operationStore } = useOperationStore()

if (!isInitialized.value && !isInitializing.value) {
  api.operation.getAll().then(operationStore.set)
}

const operation = ref(null)
const currentAction = ref(null)

const onOperationsListAction = ({ key, data }) => {
  if (key === 'MOVE_UP') {
    const index = operations.value.findIndex(({ id }) => data.id === id)
    const { id, seq } = operations.value[index - 1]

    api.operation.updateOne({ id, seq: seq + 1 })
    api.operation.updateOne({ id: data.id, seq: data.seq - 1 })
    
    return operationStore.moveUp(index)
  }

  if (key === 'MOVE_DOWN') {
    const index = operations.value.findIndex(({ id }) => data.id === id)
    const { id, seq } = operations.value[index + 1]
    
    api.operation.updateOne({ id, seq: seq - 1 })
    api.operation.updateOne({ id: data.id, seq: data.seq + 1 })

    return operationStore.moveDown(index)
  }

  currentAction.value = key
  operation.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Operations" description="Set up the operations in your production.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add operation
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <OperationsList
      :data="operations"
      @action="onOperationsListAction"
    />
  </CfAppView>

  <CreateOperation
    :last-seq="operations[operations.length - 1]?.seq"
    @success="operationStore.add"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <UpdateOperation
    :data="operation"
    @success="operationStore.update"
    @cancel="currentAction = operation = null"
    v-if="currentAction === 'EDIT'"
  />

  <DeleteOperation
    :data="operation"
    @success="operationStore.remove"
    @cancel="currentAction = operation = null"
    v-if="currentAction === 'REMOVE'"
  />
</template>