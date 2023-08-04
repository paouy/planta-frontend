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
const currentAction = ref(null)

const onMaterialsListAction = ({ key, data }) => {
  currentAction.value = key
  material.value = data
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
        <CfOutlinedButton @click="currentAction = 'ADD'">
          Add material
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <MaterialsList
      :data="materials"
      @action="onMaterialsListAction"
    />
  </CfAppView>

  <AddMaterial
    @success="onAddMaterialSuccess"
    @cancel="currentAction = null"
    v-if="currentAction === 'ADD'"
  />

  <UpdateMaterial
    :data="material"
    @success="onUpdateMaterialSuccess"
    @cancel="currentAction = material = null"
    v-if="currentAction === 'EDIT'"
  />

  <RemoveMaterial
    :data="material"
    @success="onRemoveMaterialSuccess"
    @cancel="currentAction = material = null"
    v-if="currentAction === 'REMOVE'"
  />

  <IncrementMaterial
    :data="material"
    @success="onIncrementMaterialSucess"
    @cancel="currentAction = material = null"
    v-if="currentAction === 'ADJUST'"
  />
</template>