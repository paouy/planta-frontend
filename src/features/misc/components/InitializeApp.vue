<script setup>
import { onMounted } from 'vue'
import { useMiscStore } from '../store.js'
import { useCategoryStore } from '../../category/store.js'
import { useEquipmentStore } from '../../equipment/store.js'
import { useOperationStore } from '../../operation/store.js'
import { useWorkstationStore } from '../../workstation/store.js'
import api from '../../../api/index.js'

const { startInitialization, completeInitialization } = useMiscStore()
const categoryStore = useCategoryStore()
const equipmentStore = useEquipmentStore()
const operationStore = useOperationStore()
const workstationStore = useWorkstationStore()

const invoke = async () => {
  try {
    startInitialization()

    const data = await api.misc.initializeApp()

    categoryStore.set(data.categories)
    equipmentStore.set(data.equipments)
    operationStore.set(data.operations)
    workstationStore.set(data.workstations)

    completeInitialization()
  } catch (error) {
    alert(error)
  }
}

onMounted(() => invoke())
</script>

<template></template>