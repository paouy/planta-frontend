<script setup>
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from '../../../components/index.js'

const breadcrumbs = [{ name: 'Execution', path: '/production/execution' }]

const props = defineProps({
  operationName: String,
  productionBatchId: String
})
</script>

<template>
  <CfAppView>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader :title="`Add ${props.operationName} report`"/>
  </CfAppView>
</template>