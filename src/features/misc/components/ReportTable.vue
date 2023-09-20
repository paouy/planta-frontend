<script setup>
import { ref } from 'vue'
import { CfDataTable } from 'vue-cf-ui'
import { ProductionRecordDialog } from '../../productionRecord/index.js'

const props = defineProps({ productionRecords: Array })
const columns = [
  {
    label: 'ID',
    key: 'productionOrderPublicId'
  }, {
    label: 'Product',
    key: 'productSku'
  }, {
    label: 'Workstation',
    key: 'workstation.name'
  }, {
    label: 'Equipment',
    key: 'equipment.name'
  }, {
    label: 'Quantity',
    key: 'qty',
    width: '12%'
  }, {
    label: 'Worker',
    key: 'worker.name',
    width: '18%'
  }, {
    label: 'Date',
    key: 'timestamp'
  }
]

const productionRecord = ref(null)
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.productionRecords"
    force-row-menu
    :row-actions="['View']"
    searchable
    @row-action="({ data }) => productionRecord = data"
  >
    <template v-slot:row="{ data }">
      <td>{{ data.productionOrderPublicId }}</td>
      <td>{{ data.productSku }}</td>
      <td>{{ data.workstation?.name }}</td>
      <td>{{ data.equipment?.name }}</td>
      <td>{{ (data.type === 'REJECT' ? '(' : '') + data.qty + (data.type === 'REJECT' ? ')' : '') }}</td>
      <td>{{ data.worker?.name }}</td>
      <td>{{ new Date(data.timestamp).toLocaleDateString('en-CA') }}</td>
    </template>
  </CfDataTable>

  <ProductionRecordDialog
    :data="productionRecord"
    @close="productionRecord = null"
    v-if="productionRecord"
  />
</template>