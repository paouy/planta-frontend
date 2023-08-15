<script setup>
import { ref } from 'vue'
import { useWorkerStore } from '../store.js'
import { useMiscStore } from '../../misc/store.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader, CfFilledButton } from 'vue-cf-ui'
import WorkersList from '../components/WorkersList.vue'
import CreateWorker from '../components/CreateWorker.vue'
import UpdateWorker from '../components/UpdateWorker.vue'
import DeleteWorker from '../components/DeleteWorker.vue'
import api from '../../../api/index.js'

const breadcrumbs = [
  {
    name: 'Configurations',
    path: '/settings/configurations'
  },{
    name: 'Workers'
  }
]

const { isInitialized, isInitializing } = useMiscStore()
const { workers, ...workerStore } = useWorkerStore()

if (!isInitialized.value && !isInitializing.value) {
  api.worker.getAll().then(workerStore.set)
}

const worker = ref(null)
const currentAction = ref(null)

const onWorkersListAction = ({ key, data }) => {
  currentAction.value = key
  worker.value = data
}
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Workers" description="Add, edit, or remove workers who execute your production.">
      <template #actions>
        <CfFilledButton @click="currentAction = 'CREATE'">
          Add worker
        </CfFilledButton>
      </template>
    </CfAppViewHeader>
    <WorkersList
      :data="workers"
      @action="onWorkersListAction"
    />
  </CfAppView>

  <CreateWorker
    @success="workerStore.add"
    @cancel="currentAction = null"
    v-if="currentAction === 'CREATE'"
  />

  <UpdateWorker
    :data="worker"
    @success="workerStore.update"
    @cancel="currentAction = worker = null"
    v-if="currentAction === 'EDIT'"
  />
  
  <DeleteWorker
    :data="worker"
    @success="workerStore.remove"
    @cancel="currentAction = worker = null"
    v-if="currentAction === 'REMOVE'"
  />
</template>