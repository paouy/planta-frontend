<script setup>
import { useRouter } from 'vue-router'
import { CfAppView, CfBreadcrumbs, CfAppViewHeader } from 'vue-cf-ui'
import { CreateProductionRecords } from '../features/productionRecord/index.js'

const router = useRouter()
const breadcrumbs = [{ name: 'Execution', path: `/production/execution` }]

const toSlug = (string) => string.toLowerCase().replaceAll(' ', '-')
</script>

<template>
  <CfAppView wide>
    <CfBreadcrumbs :data="breadcrumbs"/>
    <CfAppViewHeader title="Add multiple records"/>
    <CreateProductionRecords
      @success="({ name }) => router.push(`/production/execution/${toSlug(name)}`)"
      @cancel="router.push('/production/execution')"
    />
  </CfAppView>
</template>