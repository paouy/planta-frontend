<script setup>
import { ref, onMounted } from 'vue'
import { getEquipments } from '../api/index.js'
import {
  CfAppView,
  CfBreadcrumbs,
  CfAppViewHeader,
  CfFilledButton
} from '../../../components/index.js'
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

const equipments = ref([])
const equipment = ref(null)
const showAddEquipment = ref(false)
const showUpdateEquipment = ref(false)
const showRemoveEquipment = ref(false)

const onEquipmentsListAction = ({ action, item }) => {
  if (action === 'Edit') {
    showUpdateEquipment.value = true
  } else if (action === 'Remove') {
    showRemoveEquipment.value = true
  }

  equipment.value = item
}

const onAddEquipmentSuccess = (addedEquipment) => {
  equipments.value.push(addedEquipment)
}

const onUpdateEquipmentSuccess = (updatedEquipment) => {
  const equipmentIndex = equipments.value
    .findIndex(({ id }) => id === updatedEquipment.id)

  equipments.value[equipmentIndex] = updatedEquipment
}

const onRemoveEquipmentSuccess = (equipmentIndex) => {
  equipments.value.splice(equipmentIndex, 1)
}

onMounted(async () => equipments.value = await getEquipments())
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Equipment" description="Configure the equipment used in your production.">
      <template #actions>
        <CfFilledButton @click="showAddEquipment = true">
          Add equipment
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <EquipmentsList
      :data="equipments"
      @action="onEquipmentsListAction"
    />
    <AddEquipment
      @success="onAddEquipmentSuccess"
      @cancel="showAddEquipment = false"
      v-if="showAddEquipment"
    />
    <UpdateEquipment
      :data="equipment"
      @success="onUpdateEquipmentSuccess"
      @cancel="showUpdateEquipment = false"
      v-if="showUpdateEquipment"
    />
    <RemoveEquipment
      :data="equipment"
      @success="onRemoveEquipmentSuccess"
      @cancel="showRemoveEquipment = false"
      v-if="showRemoveEquipment"
    />
  </CfAppView>
</template>