<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const ctx = ref({
  publicId: '',
  firstName: '',
  lastName: ''
})

const invoke = async () => {
  try {
    isLoading.value = true

    const worker = await api.worker.createOne(ctx.value)

    emit('success', worker)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add worker" @close="emit('cancel')">
    <template #body>
      <form id="createWorker" @submit.prevent="invoke">
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
      <CfFilledButton type="submit" form="createWorker" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createWorker {
  display: grid;
  gap: 1rem;
}
</style>