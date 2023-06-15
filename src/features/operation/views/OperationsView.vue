<script setup>
import { ref, onMounted } from 'vue'
import { getOperations } from '../api/index.js'
import {
  CfAppView,
  CfBreadcrumbs,
  CfHeader,
  CfFilledButton
} from '../../../components/index.js'
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

const operations = ref([])
const operation = ref(null)
const showAddOperation = ref(false)
const showUpdateOperation = ref(false)
const showRemoveOperation = ref(false)

const onOperationsListAction = ({ action, item }) => {
  if (action === 'Edit') {
    showUpdateOperation.value = true
  } else if (action === 'Remove') {
    showRemoveOperation.value = true
  }

  operation.value = item
}

const onAddOperationSuccess = (addedOperation) => {
  operations.value = [...operations.value, addedOperation]
    .sort((a, b) => a.position - b.position)
}

const onUpdateOperationSuccess = (updatedOperation) => {
  const operationIndex = operations.value
    .findIndex(({ id }) => id === updatedOperation.id)

  operations.value[operationIndex] = updatedOperation

  operations.value = operations.value
    .sort((a, b) => a.position - b.position)
}

const onRemoveOperationSuccess = (operationIndex) => {
  operations.value.splice(operationIndex, 1)
}

onMounted(async () => operations.value = await getOperations())
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfHeader title="Operations" description="Configure the operations in your production.">
      <template #actions>
        <CfFilledButton @click="showAddOperation = true">
          Add operation
        </CfFilledButton>
      </template>
    </CfHeader>
    <OperationsList
      :data="operations"
      @action="onOperationsListAction"
    />
    <AddOperation
      @success="onAddOperationSuccess"
      @cancel="showAddOperation = false"
      v-if="showAddOperation"
    />
    <UpdateOperation
      :data="operation"
      @success="onUpdateOperationSuccess"
      @cancel="showUpdateOperation = false"
      v-if="showUpdateOperation"
    />
    <RemoveOperation
      :data="operation"
      @success="onRemoveOperationSuccess"
      @cancel="showRemoveOperation = false"
      v-if="showRemoveOperation"
    />
  </CfAppView>
</template>