<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const ctx = ref({
  name: '',
  shortName: ''
})

const invoke = async () => {
  try {
    isLoading.value = true

    const customer = await api.customer.createOne(ctx.value)

    emit('success', customer)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add customer" @close="emit('cancel')">
    <template #body>
      <form id="createCustomer" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
        <CfInput
          v-model="ctx.shortName"
          label="Short name"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createCustomer" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createCustomer {
  display: grid;
  gap: 1rem;
}
</style>