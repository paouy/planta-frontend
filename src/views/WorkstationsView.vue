<script setup>
import { ref } from 'vue'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import { useStore } from '../features/misc/index.js'
import { useWorkstationStore, CreateWorkstation, DeleteWorkstation, UpdateWorkstation, WorkstationsList } from '../features/workstation/index.js'
import api from '../api/index.js'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Workstation'
  }
]

const { isInitialized, isInitializing } = useStore()
const { workstations, ...workstationStore } = useWorkstationStore()

if (!isInitialized.value && !isInitializing.value) {
  api.workstation.getAll().then(workstationStore.set)
}

const workstation = ref(null)
const currentAction = ref(null)

const onWorkstationsListAction = ({ key, data }) => {
  currentAction.value = key
  workstation.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Workstations" description="Add, edit, or remove workstations in your facility.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add workstation
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <WorkstationsList
      :data="workstations"
      @action="onWorkstationsListAction"
    />
  </CfAppView>

  <CreateWorkstation
    @success="workstationStore.create"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <UpdateWorkstation
    :data="workstation"
    @success="workstationStore.update"
    @cancel="currentAction = workstation = null"
    v-if="currentAction === 'EDIT'"
  />

  <DeleteWorkstation
    :data="workstation"
    @success="workstationStore.remove"
    @cancel="currentAction = workstation = null"
    v-if="currentAction === 'REMOVE'"
  />
</template>