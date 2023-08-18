<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ job: Object })

const isLoading = ref(false)

const ctx = computed(() => ({
  productionOrderId: props.job.productionOrder.id,
  operation: props.job.operation,
  type: 'SHORTFALL',
  qty: props.job.qtyInput - (props.job.qtyOutput - props.job.qtyReject + props.job.qtyRework)
}))

const normalizedJob = computed(() => `${props.job.productionOrder.publicId} — ${props.job.product.normalizedName}`)
const normalizedOperationName = computed(() => props.job.operation.name.toLowerCase())
const dialogTitle = computed(() => `Close ${normalizedOperationName.value} job`)

const invoke = async () => {
  try {
    isLoading.value = true

    const productionRecord = await api.productionRecord.createOne(ctx.value)

    emit('success', productionRecord)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog :title="dialogTitle" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to continue? Closing the {{ normalizedOperationName }} job for <b>{{ normalizedJob }}</b> will result to a <b>shortfall of {{ ctx.qty }}</b>.</p>
    </template>
    <template #footer>
      <CfFilledButton
        color="red"
        :loading="isLoading"
        @click="invoke"
      >Close job</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
    </template>
  </CfDialog>
</template>