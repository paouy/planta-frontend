<script setup>
import { ref } from 'vue'
import { useOperationStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { getOperations, updateOperation } from '../api/index.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from '../../../components/index.js'
import OperationsList from '../components/OperationsList.vue'
import AddOperation from '../components/AddOperation.vue'
import UpdateOperation from '../components/UpdateOperation.vue'
import RemoveOperation from '../components/RemoveOperation.vue'

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
  getOperations().then(operationStore.set)
}

const operation = ref(null)
const currentAction = ref(null)

const onOperationsListAction = ({ key, data }) => {
  if (key === 'MOVE_UP') {
    const { id, seq } = operations.value[data.index - 1]

    updateOperation({ id, seq: seq + 1})
    updateOperation({ id: data.id, seq: data.seq - 1 })
    
    return operationStore.moveUp(data.index)
  }

  if (key === 'MOVE_DOWN') {
    const { id, seq } = operations.value[data.index + 1]
    
    updateOperation({ id, seq: seq - 1})
    updateOperation({ id: data.id, seq: data.seq + 1 })

    return operationStore.moveDown(data.index)
  }

  currentAction.value = key
  operation.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Operations" description="Configure the operations in your production.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'ADD'">
          Add operation
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <OperationsList
      :data="operations"
      @action="onOperationsListAction"
    />
  </CfAppView>

  <AddOperation
    :last-seq="operations[operations.length - 1].seq"
    @success="operationStore.add"
    @cancel="currentAction = null"
    v-if="currentAction === 'ADD'"
  />

  <UpdateOperation
    :data="operation"
    @success="operationStore.update"
    @cancel="currentAction = operation = null"
    v-if="currentAction === 'EDIT'"
  />

  <RemoveOperation
    :data="operation"
    @success="operationStore.remove"
    @cancel="currentAction = operation = null"
    v-if="currentAction === 'REMOVE'"
  />
</template>