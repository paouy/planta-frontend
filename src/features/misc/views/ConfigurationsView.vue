<script setup>
import { ref, onMounted } from 'vue'
import { getOperations } from '../../operation/api/index.js'
import { getWorkstations } from '../../workstation/api/index.js'
import { getEquipments } from '../../equipment/api/index.js'

import { CfAppView, CfHeader } from '../../../components/index.js'

import OperationsList from '../../operation/components/OperationsList.vue'
import AddOperation from '../../operation/components/AddOperation.vue'
import RemoveOperation from '../../operation/components/RemoveOperation.vue'
import UpdateOperation from '../../operation/components/UpdateOperation.vue'

import WorkstationsList from '../../workstation/components/WorkstationsList.vue'
import AddWorkstation from '../../workstation/components/AddWorkstation.vue'
import RemoveWorkstation from '../../workstation/components/RemoveWorkstation.vue'
import UpdateWorkstation from '../../workstation/components/UpdateWorkstation.vue'

import EquipmentsList from '../../equipment/components/EquipmentsList.vue'
import AddEquipment from '../../equipment/components/AddEquipment.vue'
import RemoveEquipment from '../../equipment/components/RemoveEquipment.vue'
import UpdateEquipment from '../../equipment/components/UpdateEquipment.vue'

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
const showUpdateWorkstation = ref(false)

const onWorkstaionsListRemove = (data) => {
  workstation.value = data
  showRemoveWorkstation.value = true
}

const onWorkstationsListUpdate = (data) => {
  workstation.value = data
  showUpdateWorkstation.value = true
}

const onAddWorkstation = (workstation) => {
  workstations.value.push(workstation)
}

const onRemoveWorkstation = (workstationIndex) => {
  workstations.value.splice(workstationIndex, 1)
}

const onUpdateWorkstation = (workstation) => {
  const workstationIndex = workstations.value
    .findIndex(({ id }) => id === workstation.id)

  Object.assign(workstations.value[workstationIndex], workstation)
}

const equipments = ref([])
const equipment = ref(null)
const showAddEquipment = ref(false)
const showRemoveEquipment = ref(false)
const showUpdateEquipment = ref(false)

const onEquipmentsListRemove = (data) => {
  equipment.value = data
  showRemoveEquipment.value = true
}

const onEquipmentsListUpdate = (data) => {
  equipment.value = data
  showUpdateEquipment.value = true
}

const onAddEquipment = (equipment) => {
  equipments.value.push(equipment)
}

const onRemoveEquipment = (equipmentIndex) => {
  equipments.value.splice(equipmentIndex, 1)
}

const onUpdateEquipment = (equipment) => {
  const equipmentIndex = equipments.value
    .findIndex(({ id }) => id === equipment.id)

  Object.assign(equipments.value[equipmentIndex], equipment)
}

onMounted(async () => {
  const [
    operationsFromApi,
    workstationsFromApi,
    equipmentsFromApi
  ] = await Promise.all([
    getOperations(),
    getWorkstations(),
    getEquipments()
  ])

  operations.value = operationsFromApi
  workstations.value = workstationsFromApi
  equipments.value = equipmentsFromApi

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
      @edit="onWorkstationsListUpdate"
    />
    <AddWorkstation
      @success="onAddWorkstation"
      @cancel="showAddWorkstation = false"
      v-if="showAddWorkstation"
    />
    <RemoveWorkstation
      :data="workstation"
      @success="onRemoveWorkstation"
      @cancel="showRemoveWorkstation = false, workstation = null"
      v-if="showRemoveWorkstation"
    />
    <UpdateWorkstation
      :data="workstation"
      @success="onUpdateWorkstation"
      @cancel="showUpdateWorkstation = false, workstation = null"
      v-if="showUpdateWorkstation"
    />

    <EquipmentsList
      :data="equipments"
      @add="showAddEquipment = true"
      @remove="onEquipmentsListRemove"
      @edit="onEquipmentsListUpdate"
    />
    <AddEquipment
      @success="onAddEquipment"
      @cancel="showAddEquipment = false"
      v-if="showAddEquipment"
    />
    <RemoveEquipment
      :data="equipment"
      @success="onRemoveEquipment"
      @cancel="showRemoveEquipment = false, equipment = null"
      v-if="showRemoveEquipment"
    />
    <UpdateEquipment
      :data="equipment"
      @success="onUpdateEquipment"
      @cancel="showUpdateEquipment = false, equipment = null"
      v-if="showUpdateEquipment"
    />
  </CfAppView>
</template>