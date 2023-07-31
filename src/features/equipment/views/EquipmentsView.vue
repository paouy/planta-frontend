<script setup>
import { ref } from 'vue'
import { useEquipmentStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { getEquipments } from '../api/index.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from '../../../components/index.js'
import EquipmentsList from '../components/EquipmentsList.vue'
import AddEquipment from '../components/AddEquipment.vue'
import UpdateEquipment from '../components/UpdateEquipment.vue'
import RemoveEquipment from '../components/RemoveEquipment.vue'

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
  getEquipments().then(equipmentStore.set)
}

const equipment = ref(null)
const currentAction = ref(null)

const onEquipmentsListAction = ({ action, data }) => {
  currentAction.value = action
  equipment.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Equipment" description="Configure the equipment used in your production.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'ADD'">
          Add equipment
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <EquipmentsList
      :data="equipments"
      @action="onEquipmentsListAction"
    />
    <AddEquipment
      @success="equipmentStore.add"
      @cancel="currentAction = null"
      v-if="currentAction === 'ADD'"
    />
    <UpdateEquipment
      :data="equipment"
      @success="equipmentStore.update"
      @cancel="currentAction = null"
      v-if="currentAction === 'EDIT'"
    />
    <RemoveEquipment
      :data="equipment"
      @success="equipmentStore.remove"
      @cancel="currentAction = null"
      v-if="currentAction === 'REMOVE'"
    />
  </CfAppView>
</template>