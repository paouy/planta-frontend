<script setup>
import { ref } from 'vue'
import { addCustomer } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const customer = ref({
  name: '',
  shortName: ''
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const createdCustomer = await addCustomer(customer.value)

    emit('success', createdCustomer)
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
      <form id="addCustomer" @submit.prevent="onSubmit">
        <CfField
          v-model="customer.name"
          label="Name"
          required
        />
        <CfField
          v-model="customer.shortName"
          label="Short name"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="addCustomer" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#addCustomer {
  display: grid;
  gap: 1rem;
}
</style>