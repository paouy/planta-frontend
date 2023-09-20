<script setup>
import { computed } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'

const emit = defineEmits(['close'])
const props = defineProps({ data: Object })

const dialogTitle = computed(() => {
  const productionOrderPublicId = props.data.productionOrderPublicId
  const suffix = productionOrderPublicId ? ` for ${productionOrderPublicId}` : ''

  return `${props.data.operation.name} record` + suffix
})
</script>

<template>
  <CfDialog :title="dialogTitle" @close="emit('close')">
    <template #body>
      <form id="productionRecord">
        <CfInput
          label="Date"
          :value="new Date(props.data.timestamp).toLocaleDateString('en-CA')"
          disabled
        />
        <CfInput
          label="Product"
          :value="props.data.productSku"
          disabled
          v-if="props.data.productSku"
        />
        <CfInput
          label="Workstation"
          :value="props.data.workstation.name"
          disabled
        />
        <CfInput
          label="Type"
          :value="props.data.type"
          disabled
        />
        <CfInput
          label="Worker"
          :value="props.data.worker.name"
          disabled
          v-if="props.data.worker"
        />
        <CfInput
          label="Equipment"
          :value="props.data.equipment?.name"
          disabled
          v-if="props.data.equipment"
        />
        <CfInput
          label="Quantity"
          :value="props.data.qty"
          disabled
        />
        <CfInput
          label="Duration"
          suffix="mins"
          :value="props.data.timeTakenMins"
          disabled
          v-if="props.data.timeTakenMins"
        />
        <CfInput
          v-for="customData in props.data.meta"
          :label="customData.label"
          :suffix="customData.uom"
          :value="customData.value"
          disabled
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton @click="emit('close')">Close</CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#productionRecord {
  display: grid;
  gap: 1rem;
}
</style>