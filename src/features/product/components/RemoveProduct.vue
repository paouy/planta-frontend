<script setup>
import { ref } from 'vue'
import { removeProduct } from '../api/index.js'
import { CfDialog, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)

const onClick = async () => {
  try {
    isLoading.value = true

    await removeProduct(props.data.id)

    emit('success', props.data.index)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Remove product" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to remove <b>{{ props.data?.name }}</b> from the inventory?</p>
    </template>
    <template #footer>
      <CfFilledButton
        color="red"
        :loading="isLoading"
        @click="onClick"
      >Remove</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
    </template>
  </CfDialog>
</template>