<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: '',
  publicId: '',
  firstName: '',
  lastName: ''
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.worker.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

Object.assign(ctx.value, props.data)
</script>

<template>
  <CfDialog title="Update worker" @close="emit('cancel')">
    <template #body>
      <form id="updateWorker" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.publicId"
          label="ID"
          required
        />
        <CfInput
          v-model="ctx.firstName"
          label="First name"
          required
        />
        <CfInput
          v-model="ctx.lastName"
          label="Last name"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateWorker" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateWorker {
  display: grid;
  gap: 1rem;
}
</style>