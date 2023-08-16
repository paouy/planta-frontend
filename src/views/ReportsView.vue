<script setup>
import { ref } from 'vue'
import { CfAppView, CfAppViewHeader } from 'vue-cf-ui'
import { ReportsFilters, ReportsSummary } from '../features/misc/index.js'

const operations = ref([])
const workstations = ref([])
const workers = ref([])
const equipments = ref([])
const productionRecords = ref([])
</script>

<template>
  <CfAppView>
    <CfAppViewHeader title="Reports"/>
    <ReportsSummary :production-records="productionRecords"/>
    <ReportsFilters
      v-model:operations="operations"
      v-model:workstations="workstations"
      v-model:workers="workers"
      v-model:equipments="equipments"
    />
  </CfAppView>
</template>