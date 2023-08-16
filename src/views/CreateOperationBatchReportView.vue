<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from 'vue-cf-ui'
import { CreateOperationBatchReport } from '../features/operationBatch/index.js'
import api from '../api/index.js'

const router = useRouter()
const props = defineProps({
  operationSlug: String,
  operationBatchId: String
})

const operationBatch = ref({
  publicId: '',
  operationId: '',
  workstation: {
    id: '',
    name: ''
  },
  schedule: ''
})
const jobs = ref([])

const operationName = computed(() => props.operationSlug.replaceAll('-', ' '))
const breadcrumbs = computed(() => [
  { name: 'Execution', path: `/production/execution/${props.operationSlug}` },
  { name: `Add ${operationName.value} report` }
])

onMounted(() => {
  api.operationBatch
    .getOne(props.operationBatchId)
    .then(data => operationBatch.value = data)

  api.job
    .getAll({ operationBatchId: props.operationBatchId })
    .then(data => jobs.value = data)
})
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="`Add ${operationName} report`"/>
    <dl class="operationBatchDetails">
      <dt>Batch ID:</dt>
      <dd>{{ operationBatch?.publicId }}</dd>
      <dt>Workstation:</dt>
      <dd>{{ operationBatch?.workstation.name }}</dd>
    </dl>
    <CreateOperationBatchReport
      :operation-batch="operationBatch"
      :jobs="jobs"
      @success="router.push(breadcrumbs[0].path)"
      @cancel="router.push(breadcrumbs[0].path)"
      v-if="operationBatch"
    />
  </CfAppView>
</template>

<style lang="scss">
.operationBatchDetails {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  column-gap: 0.5rem;
  margin-bottom: 2rem;

  dt {
    color: var(--cf-gray-3);
  }
}
</style>