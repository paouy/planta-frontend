<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfFilledButton } from '../../../components/index.js'
import { addProductionRecord } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ productionJob: Object })

const isLoading = ref(false)

const normalizedOperationName = computed(() => props.productionJob.operation.name.toLowerCase())
const normalizedProductionOrder = computed(() => `${props.productionJob.productionOrder.friendlyId} — ${props.productionJob.product.name}`)
const shortfallQty = computed(() => {
  const { output, reject, rework, adjustment } = props.productionJob.operation.summary

  return  props.productionJob.qtyExpected - (output + reject + rework + adjustment)
})
const dialogTitle = computed(() => `Close ${normalizedOperationName.value} job`)


const onClick = async () => {
  try {
    isLoading.value = true

    const addedProductionRecord = await addProductionRecord({
      productionJobId: props.productionJob.id,
      type: 'SHORTFALL',
      qty: shortfallQty.value * -1
    })

    emit('success', addedProductionRecord)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog :title="dialogTitle" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to continue? Closing the {{ normalizedOperationName }} job for <b>{{ normalizedProductionOrder }}</b> will result to a <b>shortfall of {{ shortfallQty }}</b>.</p>
    </template>
    <template #footer>
      <CfFilledButton
        color="red"
        :loading="isLoading"
        @click="onClick"
      >Close job</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
    </template>
  </CfDialog>
</template>