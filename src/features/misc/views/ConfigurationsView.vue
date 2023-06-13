<script setup>
import { ref, onMounted } from 'vue'
import { getOperations } from '../../operation/api/index.js'
import { CfAppView, CfHeader } from '../../../components/index.js'
import OperationsList from '../../operation/components/OperationsList.vue'
import AddOperation from '../../operation/components/AddOperation.vue'
import RemoveOperation from '../../operation/components/RemoveOperation.vue'
import WorkstationsList from '../../workstation/components/WorkstationsList.vue'

const operations = ref([])
const operation = ref(null)
const showAddOperation = ref(false)
const showRemoveOperation = ref(false)

const onAddOperation = (operation) => {
  operations.value = 
    [...operations.value, operation].sort((a, b) => a.position - b.position)
}

const onOperationListRemove = (data) => {
  operation.value = data
  showRemoveOperation.value = true
}

const onRemoveOperation = (operationIndex) => {
  operations.value.splice(operationIndex, 1)
}

onMounted(async () => {
  operations.value = await getOperations()
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
      @remove="onOperationListRemove"
    />
    <WorkstationsList/>
  </CfAppView>

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
</template>