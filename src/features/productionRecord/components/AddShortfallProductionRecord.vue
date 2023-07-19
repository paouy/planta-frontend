<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfFilledButton } from '../../../components/index.js'
import { addProductionRecord } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ job: Object })

const isLoading = ref(false)

const normalizedOperationName = computed(() => props.job.operation.name.toLowerCase())
const normalizedProductionOrder = computed(() => `${props.job.productionOrder.friendlyId} — ${props.job.productName}`)
const shortfallQty = computed(() => props.job.qtyExpected - props.job.qtyProduced)
const dialogTitle = computed(() => `Close ${normalizedOperationName.value} job`)

const onClick = async () => {
  try {
    isLoading.value = true

    const addedProductionRecord = await addProductionRecord({
      productionOrderId: props.job.productionOrder.id,
      operationId: props.job.operation.id,
      type: 'SHORTFALL',
      qty: shortfallQty.value
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