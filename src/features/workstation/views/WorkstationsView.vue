<script setup>
import { ref, onMounted } from 'vue'
import { getWorkstations } from '../api/index.js'
import {
  CfAppView,
  CfBreadcrumbs,
  CfHeader,
  CfFilledButton
} from '../../../components/index.js'
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

const workstations = ref([])
const workstation = ref(null)
const showAddWorkstation = ref(false)
const showUpdateWorkstation = ref(false)
const showRemoveWorkstation = ref(false)

const onWorkstationsListAction = ({ action, item }) => {
  if (action === 'Edit') {
    showUpdateWorkstation.value = true
  } else if (action === 'Remove') {
    showRemoveWorkstation.value = true
  }

  workstation.value = item
}

const onAddWorkstationSuccess = (addedWorkstation) => {
  workstations.value.push(addedWorkstation)
}

const onUpdateWorkstationSuccess = (updatedWorkstation) => {
  const workstationIndex = workstations.value
    .findIndex(({ id }) => id === updatedWorkstation.id)

  workstations.value[workstationIndex] = updatedWorkstation
}

const onRemoveWorkstationSuccess = (workstationIndex) => {
  workstations.value.splice(workstationIndex, 1)
}

onMounted(async () => workstations.value = await getWorkstations())
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfHeader title="Workstations" description="Configure the workstations in your facility.">
      <template #actions>
        <CfFilledButton @click="showAddWorkstation = true">
          Add workstation
        </CfFilledButton>
      </template>
    </CfHeader>
    <WorkstationsList
      :data="workstations"
      @action="onWorkstationsListAction"
    />
    <AddWorkstation
      @success="onAddWorkstationSuccess"
      @cancel="showAddWorkstation = false"
      v-if="showAddWorkstation"
    />
    <UpdateWorkstation
      :data="workstation"
      @success="onUpdateWorkstationSuccess"
      @cancel="showUpdateWorkstation = false"
      v-if="showUpdateWorkstation"
    />
    <RemoveWorkstation
      :data="workstation"
      @success="onRemoveWorkstationSuccess"
      @cancel="showRemoveWorkstation = false"
      v-if="showRemoveWorkstation"
    />
  </CfAppView>
</template>