<script setup>
import { CfDataTable } from 'vue-cf-ui'

const emit = defineEmits(['action'])
const props = defineProps({ data: Array })
const columns = [
  {
    label: 'ID',
    key: 'publicId',
    width: '8.5rem'
  }, {
    label: 'Product',
    key: 'product.normalizedName'
  }, {
    label: 'Quantity',
    key: 'qtyMade'
  }
]
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="props.data"
    searchable
    :row-actions="['View']"
    @row-action="$event => emit('action', $event)"
  />
</template>