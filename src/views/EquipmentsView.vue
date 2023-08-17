<script setup>
import { ref } from 'vue'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { useEquipmentStore, CreateEquipment, DeleteEquipment, EquipmentsList, UpdateEquipment } from '../features/equipment/index.js'
import { useStore } from '../features/misc/index.js'
import api from '../api/index.js'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Equipment'
  }
]

const { isInitialized, isInitializing } = useStore()
const { equipments, ...equipmentStore } = useEquipmentStore()

if (!isInitialized.value && !isInitializing.value) {
  api.equipment.getAll().then(equipmentStore.set)
}

const equipment = ref(null)
const currentAction = ref(null)

const onEquipmentsListAction = ({ key, data }) => {
  currentAction.value = key
  equipment.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Equipment" description="Add, edit, or remove  equipment used in your production.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add equipment
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <EquipmentsList
      :data="equipments"
      @action="onEquipmentsListAction"
    />
  </CfAppView>

  <CreateEquipment
    @success="equipmentStore.add"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <UpdateEquipment
    :data="equipment"
    @success="equipmentStore.update"
    @cancel="currentAction = equipment = null"
    v-if="currentAction === 'EDIT'"
  />
  
  <DeleteEquipment
    :data="equipment"
    @success="equipmentStore.remove"
    @cancel="currentAction = equipment = null"
    v-if="currentAction === 'REMOVE'"
  />
</template>