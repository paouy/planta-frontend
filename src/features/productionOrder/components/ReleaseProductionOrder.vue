<script setup>
import { ref } from 'vue'
import { releaseProductionOrder } from '../api/index.js'
import { CfDialog, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)

const onClick = async () => {
  try {
    isLoading.value = true

    await releaseProductionOrder(props.data.id)

    emit('success', { id: props.data.id })
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
      <p>Are you sure you want to release <b>{{ props.data.friendlyId + ' — ' + props.data.product.name}}</b>? This will add {{ props.data.qtyProduced }} {{ props.data.product.uom }} to the inventory.</p>
    </template>
    <template #footer>
      <CfFilledButton :loading="isLoading" @click="onClick">
        Release
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>