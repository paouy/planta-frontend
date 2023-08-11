<script setup>
import { ref } from 'vue'
import { CfDialog, CfFilledButton } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)

const invoke = async () => {
  try {
    isLoading.value = true

    await api.productionOrder.release(props.data.id)

    emit('success', props.data.id)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Release production order" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to release <b>{{ props.data.publicId + ' — ' + props.data.product.normalizedName }}</b>? This will add {{ props.data.qtyMade }} {{ props.data.product.uom }} to the inventory.</p>
    </template>
    <template #footer>
      <CfFilledButton :loading="isLoading" @click="invoke">
        Release
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>