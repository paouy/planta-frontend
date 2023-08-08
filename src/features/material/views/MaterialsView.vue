<script setup>
import { ref, onMounted } from 'vue'
import { CfAppView, CfAppViewHeader, CfOutlinedButton } from '../../../components/index.js'
import MaterialsList from '../components/MaterialsList.vue'
import CreateMaterial from '../components/CreateMaterial.vue'
import UpdateMaterial from '../components/UpdateMaterial.vue'
import DeleteMaterial from '../components/DeleteMaterial.vue'
import IncrementMaterial from '../components/IncrementMaterial.vue'
import api from '../../../api/index.js'

const materials = ref([])
const material = ref(null)
const currentAction = ref(null)

const onMaterialsListAction = ({ key, data }) => {
  currentAction.value = key
  material.value = data
}

const onCreateMaterial = (data) => {
  materials.value.push(data)
}

const onUpdateMaterial = (data) => {
  const index = materials.value.findIndex(({ id }) => id === data.id)
  materials.value[index] = data
}

const onDeleteMaterial = (index) => {
  materials.value.splice(index, 1)
}

const onIncrementMaterial = (data) => {
  const index = materials.value.findIndex(({ id }) => id === data.id)
  Object.assign(materials.value[index], data)
}

onMounted(async () => materials.value = await api.material.getAll())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Inventory" title="Materials">
      <template #actions>
        <CfOutlinedButton @click="currentAction = 'CREATE'">
          Add material
        </CfOutlinedButton>
      </template>
    </CfAppViewHeader>
    <MaterialsList
      :data="materials"
      @action="onMaterialsListAction"
    />
  </CfAppView>

  <CreateMaterial
    @success="onCreateMaterial"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <UpdateMaterial
    :data="material"
    @success="onUpdateMaterial"
    @cancel="currentAction = material = null"
    v-if="currentAction === 'EDIT'"
  />

  <DeleteMaterial
    :data="material"
    @success="onDeleteMaterial"
    @cancel="currentAction = material = null"
    v-if="currentAction === 'REMOVE'"
  />

  <IncrementMaterial
    :data="material"
    @success="onIncrementMaterial"
    @cancel="currentAction = material = null"
    v-if="currentAction === 'ADJUST'"
  />
</template>