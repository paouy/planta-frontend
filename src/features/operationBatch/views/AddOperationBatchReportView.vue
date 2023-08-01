<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOperationBatch } from '../api/index.js'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from '../../../components/index.js'
import AddOperationBatchReport from '../components/AddOperationBatchReport.vue'

const router = useRouter()

const props = defineProps({
  operationSlug: String,
  operationBatchId: String
})

const breadcrumbs = computed(() => [{
  name: 'Execution',
  path: `/production/execution/${props.operationSlug}`
}])

const operationName = computed(() => props.operationSlug.replaceAll('-', ' '))

const operationBatch = ref(null)

onMounted(async () => operationBatch.value = await getOperationBatch(props.operationBatchId))
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="`Add ${operationName} report`"/>
    <dl class="operationBatchInfo">
      <dt>Batch ID:</dt>
      <dd>{{ operationBatch?.friendlyId }}</dd>
      <dt>Workstation:</dt>
      <dd>{{ operationBatch?.workstation.name }}</dd>
      <dt>Equipment:</dt>
      <dd>{{ operationBatch?.equipment.name }}</dd>
    </dl>
    <AddOperationBatchReport
      :operation-batch="operationBatch"
      @success="router.push(breadcrumbs[0].path)"
      @cancel="router.push(breadcrumbs[0].path)"
      v-if="operationBatch"
    />
  </CfAppView>
</template>

<style lang="scss">
.operationBatchInfo {
  display: grid;
  grid-template-columns: repeat(2, max-content);
  column-gap: 0.5rem;
  margin-bottom: 2rem;

  dt {
    color: var(--cf-gray-3);
  }
}
</style>