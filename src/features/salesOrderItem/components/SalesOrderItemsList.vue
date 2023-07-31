<script setup>
import { computed } from 'vue'
import { CfDataTable } from '../../../components/index.js'

const props = defineProps({ data: Array })

const columns = [
  {
    label: 'Name',
    key: 'product.normalizedName',
    width: '40%'
  }, {
    label: 'Required',
    key: 'qty'
  }, {
    label: 'Making',
    key: 'allocated'
  }, {
    label: 'Allocated',
    key: 'inProduction'
  }
]

const data = computed(() => {
  return props.data.map(item => {
    const actions = ['Allocate', 'Make']

    return {
      ...item,
      actions
    }
  })
})
</script>

<template>
  <CfDataTable
    :columns="columns"
    :data="data"
    row-actions
  />
</template>