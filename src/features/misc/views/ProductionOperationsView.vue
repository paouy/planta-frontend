<script setup>
import { ref, onMounted } from 'vue'
import { getProductionJobs } from '../../productionJob/api/index.js'
import {
  CfAppView,
  CfAppViewHeader
} from '../../../components/index.js'
import OperationSelect from '../../operation/components/OperationSelect.vue'

const productionJobs = ref([])

onMounted(async () => productionJobs.value = await getProductionJobs())
</script>

<template>
  <CfAppView>
    <CfAppViewHeader surtitle="Production" title="Operations"/>
    <pre>{{ productionJobs }}</pre>
    <OperationSelect/>
  </CfAppView>
</template>