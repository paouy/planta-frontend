<script setup>
import { ref } from 'vue'
import { CfDialog, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  isDisabled: true
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.user.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Disable user" @close="emit('cancel')">
    <template #body>
      <p>Are you sure you want to disable <b>{{ `${props.data.lastName}, ${props.data.firstName}` }}</b> ?</p>
    </template>
    <template #footer>
      <CfFilledButton :loading="isLoading" @click="invoke">
        Disable
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>