<script setup>
import { ref } from 'vue'
import { CfDialog, CfFilledButton } from '../../../components/index.js'
import { removeOperation } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)

const onClick = async () => {
  try {
    isLoading.value = true

    await removeOperation(props.data.id)

    emit('success', props.data.index)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Remove operation" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to remove {{ props.data?.name }} from your production operations?</p>
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