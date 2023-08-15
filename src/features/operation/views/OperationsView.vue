<script setup>
import { ref } from 'vue'
import { useOperationStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from '../../../components/index.js'
import OperationsList from '../components/OperationsList.vue'
import CreateOperation from '../components/CreateOperation.vue'
import UpdateOperation from '../components/UpdateOperation.vue'
import DeleteOperation from '../components/DeleteOperation.vue'
import api from '../../../api/index.js'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Operations'
  }
]

const { isInitialized, isInitializing } = useMiscStore()
const { operations, ...operationStore } = useOperationStore()

if (!isInitialized.value && !isInitializing.value) {
  api.operation.getAll().then(operationStore.set)
}

const operation = ref(null)
const currentAction = ref(null)

const onOperationsListAction = ({ key, data }) => {
  if (key === 'MOVE_UP') {
    const { id, seq } = operations.value[data.index - 1]

    api.operation.updateOne({ id, seq: seq + 1})
    api.operation.updateOne({ id: data.id, seq: data.seq - 1 })
    
    return operationStore.moveUp(data.index)
  }

  if (key === 'MOVE_DOWN') {
    const { id, seq } = operations.value[data.index + 1]
    
    api.operation.updateOne({ id, seq: seq - 1})
    api.operation.updateOne({ id: data.id, seq: data.seq + 1 })

    return operationStore.moveDown(data.index)
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