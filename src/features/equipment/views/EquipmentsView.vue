<script setup>
import { ref } from 'vue'
import { useEquipmentStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from '../../../components/index.js'
import EquipmentsList from '../components/EquipmentsList.vue'
import CreateEquipment from '../components/CreateEquipment.vue'
import UpdateEquipment from '../components/UpdateEquipment.vue'
import DeleteEquipment from '../components/DeleteEquipment.vue'
import api from '../../../api/index.js'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Equipment'
  }
]

const { isInitialized, isInitializing } = useMiscStore()
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
    <CfAppViewHeader title="Equipment" description="Configure the equipment used in your production.">
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