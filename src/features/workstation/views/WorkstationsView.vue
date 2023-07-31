<script setup>
import { ref } from 'vue'
import { useWorkstationStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { getWorkstations } from '../api/index.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from '../../../components/index.js'
import WorkstationsList from '../components/WorkstationsList.vue'
import AddWorkstation from '../components/AddWorkstation.vue'
import UpdateWorkstation from '../components/UpdateWorkstation.vue'
import RemoveWorkstation from '../components/RemoveWorkstation.vue'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Workstation'
  }
]

const { isInitialized, isInitializing } = useMiscStore()
const { workstations, ...workstationStore } = useWorkstationStore()

if (!isInitialized.value && !isInitializing.value) {
  getWorkstations().then(workstationStore.set)
}

const workstation = ref(null)
const currentAction = ref(null)

const onWorkstationsListAction = ({ action, data }) => {
  currentAction.value = action
  workstation.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Workstations" description="Configure the workstations in your facility.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'ADD'">
          Add workstation
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <WorkstationsList
      :data="workstations"
      @action="onWorkstationsListAction"
    />
    <AddWorkstation
      @success="workstationStore.add"
      @cancel="currentAction = null"
      v-if="currentAction === 'ADD'"
    />
    <UpdateWorkstation
      :data="workstation"
      @success="workstationStore.update"
      @cancel="currentAction = null"
      v-if="currentAction === 'EDIT'"
    />
    <RemoveWorkstation
      :data="workstation"
      @success="workstationStore.remove"
      @cancel="currentAction = null"
      v-if="currentAction === 'REMOVE'"
    />
  </CfAppView>
</template>