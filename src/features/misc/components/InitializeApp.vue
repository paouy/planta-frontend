<script setup>
import { onMounted } from 'vue'
import { initializeApp } from '../api/index.js'
import { useMiscStore } from '../store.js'
import { useCollectionStore } from '../../collection/store.js'
import { useEquipmentStore } from '../../equipment/store.js'
import { useOperationStore } from '../../operation/store.js'
import { useWorkstationStore } from '../../workstation/store.js'

const { isInitialized, ...miscStore } = useMiscStore()
const collectionStore = useCollectionStore()
const equipmentStore = useEquipmentStore()
const operationStore = useOperationStore()
const workstationStore = useWorkstationStore()

onMounted(async () => {
  if (!isInitialized.value) {
    try {
      miscStore.startInitialization()

      const {
        collections,
        equipments,
        operations,
        workstations
      } = await initializeApp()

      collectionStore.set(collections)
      equipmentStore.set(equipments)
      operationStore.set(operations)
      workstationStore.set(workstations)

      miscStore.completeInitialization()
    } catch (error) {
      alert(error)
    }
  }
})
</script>

<template></template>