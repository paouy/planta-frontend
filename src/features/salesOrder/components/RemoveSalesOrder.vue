<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfSelect, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  status: null
})

const computedOptions = computed(() => {
  const options = [
    { label: 'Cancelled by customer', value: 'CANCELLED_BY_CUSTOMER' },
    { label: 'Cancelled by us', value: 'CANCELLED_BY_MANUFACTURER' }
  ]

  if (props.data.status === 'OPEN') {
    options.push({ label: 'Created by mistake', value: 'DELETE' })
  }

  return options
})

const invoke = async () => {
  try {
    isLoading.value = true

    if (ctx.value.status === 'DELETE') {
      await api.salesOrder.deleteOne(props.data.id)
    } else {
      await api.salesOrder.cancel(ctx.value)
    }

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Remove sales order" @close="emit('cancel')">
    <template #body>
      <form id="removeSalesOrder" @submit.prevent="invoke">
        <p>Removing <b>{{ props.data.publicId }} ({{ props.data.customer.shortName }})</b> is permanent. Select a reason below to proceed.</p>
        <CfSelect
          v-model="ctx.status"
          label="Reason"
          :options="computedOptions"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton color="red" type="submit" form="removeSalesOrder" :loading="isLoading" :disabled="!ctx.status">
        Remove
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#removeSalesOrder {
  display: grid;
  gap: 1rem;
}
</style>