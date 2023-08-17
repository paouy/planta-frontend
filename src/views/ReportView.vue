<script setup>
import { ref, computed, watch } from 'vue'
import { CfAppView, CfAppViewHeader } from 'vue-cf-ui'
import { ReportFilters, ReportSummary, ReportTable } from '../features/misc/index.js'
import DateRangeInput from '../components/DateRangeInput.vue'
import api from '../api/index.js'

const dateRange = ref(['', ''])
const equipments = ref([])
const operations = ref([])
const workers = ref([])
const workstations = ref([])
const productionRecords = ref([])

const filteredProductionRecords = computed(() => {
  const equipmentIds = equipments.value.map(({ id }) => id)
  const operationIds = operations.value.map(({ id }) => id)
  const workerIds = workers.value.map(({ id }) => id)
  const workstationIds = workstations.value.map(({ id }) => id)

  return productionRecords.value
    .filter(({ operation }) => operationIds.length ? operationIds.includes(operation.id) : true)
    .filter(({ workstation }) => workstationIds.length ? workstationIds.includes(workstation.id) : true)
    .filter(({ equipment }) => equipmentIds.length ? equipmentIds.includes(equipment.id) : true)
    .filter(({ worker }) => workerIds.length ? workerIds.includes(worker.id) : true)
})

watch(dateRange, ([startDate, endDate]) => {
  if (startDate && endDate) {
    const from = new Date(`${startDate}, GMT+8`).getTime()
    const to = new Date(`${endDate}, 23:59:59 GMT+8`).getTime()

    api.productionRecord
      .getAll({ from, to })
      .then(data => productionRecords.value = data)
  }
})
</script>

<template>
  <CfAppView>
    <CfAppViewHeader title="Reports">
      <template #actions>
        <DateRangeInput v-model="dateRange"/>
      </template>
    </CfAppViewHeader>
    <ReportSummary :production-records="filteredProductionRecords"/>
    <ReportFilters
      v-model:operations="operations"
      v-model:workstations="workstations"
      v-model:workers="workers"
      v-model:equipments="equipments"
    />
    <ReportTable :production-records="filteredProductionRecords"/>
  </CfAppView>
</template>