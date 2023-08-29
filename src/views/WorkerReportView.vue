<script setup>
import { useRouter } from 'vue-router'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from 'vue-cf-ui'
import { CreateWorkerReport } from '../features/misc/index.js'

const router = useRouter()
const breadcrumbs = [{ name: 'Execution', path: `/production/execution` }]
</script>

<template>
  <CfAppView wide>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Add worker report"/>
    <CreateWorkerReport @dismiss="router.push('/production/execution')"/>
  </CfAppView>
</template>