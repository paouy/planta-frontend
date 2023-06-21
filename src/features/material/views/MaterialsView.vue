<script setup>
import { ref, onMounted } from 'vue'
import { getMaterials } from '../api/index.js'
import {
  CfAppView,
  CfAppViewHeader,
  CfOutlinedButton
} from '../../../components/index.js'
import MaterialsList from '../components/MaterialsList.vue'
import AddMaterial from '../components/AddMaterial.vue'
import UpdateMaterial from '../components/UpdateMaterial.vue'
import RemoveMaterial from '../components/RemoveMaterial.vue'
import IncrementMaterial from '../components/IncrementMaterial.vue'

const materials = ref([])
const material = ref(null)
const showAddMaterial = ref(false)
const showUpdateMaterial = ref(false)
const showRemoveMaterial = ref(false)
const showIncrementMaterial = ref(false)

const onMaterialsListAction = ({ action, item }) => {
  if (action === 'Edit') {
    showUpdateMaterial.value = true
  } else if (action === 'Remove') {
    showRemoveMaterial.value = true
  } else {
    showIncrementMaterial.value = true
  }

  material.value = item
}

const onAddMaterialSuccess = (addedMaterial) => {
  materials.value.push(addedMaterial)
}

const onUpdateMaterialSuccess = (updatedMaterial) => {
  const materialIndex = materials.value
    .findIndex(({ id }) => id === updatedMaterial.id)

  materials.value[materialIndex] = updatedMaterial
}

const onRemoveMaterialSuccess = (materialIndex) => {
  materials.value.splice(materialIndex, 1)
}

const onIncrementMaterialSucess = (incrementedMaterial) => {
  const materialIndex = materials.value
    .findIndex(({ id }) => id === incrementedMaterial.id)

  Object.assign(materials.value[materialIndex], incrementedMaterial)
}

onMounted(async () => materials.value = await getMaterials())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Inventory" title="Materials">
      <template #actions>
        <CfOutlinedButton @click="showAddMaterial = true">
          Add material
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <MaterialsList
      :data="materials"
      @action="onMaterialsListAction"
    />
    <AddMaterial
      @success="onAddMaterialSuccess"
      @cancel="showAddMaterial = false"
      v-if="showAddMaterial"
    />
    <UpdateMaterial
      :data="material"
      @success="onUpdateMaterialSuccess"
      @cancel="showUpdateMaterial = false"
      v-if="showUpdateMaterial"
    />
    <RemoveMaterial
      :data="material"
      @success="onRemoveMaterialSuccess"
      @cancel="showRemoveMaterial = false"
      v-if="showRemoveMaterial"
    />
    <IncrementMaterial
      :data="material"
      @success="onIncrementMaterialSucess"
      @cancel="showIncrementMaterial = false"
      v-if="showIncrementMaterial"
    />
  </CfAppView>
</template>