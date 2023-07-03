<script setup>
import { ref } from 'vue'
import { useOperationStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { getOperations } from '../api/index.js'
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

const onOperationsListAction = ({ action, item }) => {
  currentAction.value = action
  operation.value = item
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
    <AddOperation
      @success="operationStore.add"
      @cancel="currentAction = null"
      v-if="currentAction === 'ADD'"
    />
    <UpdateOperation
      :data="operation"
      @success="operationStore.update"
      @cancel="currentAction = null"
      v-if="currentAction === 'EDIT'"
    />
    <RemoveOperation
      :data="operation"
      @success="operationStore.remove"
      @cancel="currentAction = null"
      v-if="currentAction === 'REMOVE'"
    />
  </CfAppView>
</template>