<script setup>
import { CfDataTable } from 'vue-cf-ui'

const props = defineProps({ data: Array })
const columns = [
  {
    label: 'Date',
    key: 'timestamp'
  }, {
    label: 'Product',
    key: 'product.normalizedName',
    width: '60%'
  }, {
    label: 'Quantity',
    key: 'qty'
  }
]
</script>

<template>
  <CfDataTable
    :data="props.data"
    :columns="columns"
  >
    <template v-slot:row="{ data }">
      <td>{{ new Date(data.timestamp).toLocaleDateString('en-CA') }}</td>
      <td>{{ data.product.normalizedName }}</td>
      <td>{{ data.qty }} {{ data.product.uom }}</td>
    </template>
  </CfDataTable>
</template>