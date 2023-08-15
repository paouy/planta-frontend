<script setup>
import { ref } from 'vue'
import { CfDialog, CfSelect, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })
const actionOptions = [
  { label: 'Cancelled', value: 'CANCEL' },
  { label: 'Created by mistake', value: 'DELETE' }
]

const isLoading = ref(false)
const action = ref(null)

const invoke = async () => {
  try {
    isLoading.value = true

    if (action.value === 'DELETE') {
      await api.productionOrder.deleteOne(props.data.id)
    } else {
      await api.productionOrder.cancel(props.data.id)
    }

    emit('success')
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Remove production order" @close="emit('cancel')">
    <template #body>
      <form id="removeProductionOrder" @submit.prevent="invoke">
        <p>Removing <b>{{ props.data.publicId + ' — ' + props.data.product.normalizedName }}</b> is permanent. Select a reason below to proceed.</p>
        <CfSelect
          v-model="action"
          label="Reason"
          :options="actionOptions"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton color="red" type="submit" form="removeProductionOrder" :loading="isLoading">
        Remove
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#removeProductionOrder {
  display: grid;
  gap: 1rem;
}
</style>