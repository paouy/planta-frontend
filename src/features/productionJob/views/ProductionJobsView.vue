<script setup>
import { ref, onMounted } from 'vue'
import { getProductionJobs } from '../api/index.js'
import {
  CfAppView,
  CfAppViewHeader
} from '../../../components/index.js'
import ProductionJobsList from '../components/ProductionJobsList.vue'

const productionJobs = ref([])

onMounted(async () => productionJobs.value = await getProductionJobs())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Jobs"/>
    <ProductionJobsList :data="productionJobs"/>
  </CfAppView>
</template>