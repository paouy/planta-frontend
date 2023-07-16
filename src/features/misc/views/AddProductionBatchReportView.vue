<script setup>
import { computed } from 'vue'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from '../../../components/index.js'

const props = defineProps({
  operationSlug: String,
  productionBatchId: String
})

const breadcrumbs = computed(() => [{
  name: 'Execution',
  path: `/production/execution/${props.operationSlug}`
}])

const operationName = computed(() => props.operationSlug.replaceAll('-', ' '))
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="`Add ${operationName} report`"/>
  </CfAppView>
</template>