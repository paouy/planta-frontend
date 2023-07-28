<script setup>
import { ref } from 'vue'
import { updateCustomer } from '../api/index.js'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const customer = ref({
  id: props.data.id,
  name: props.data.name,
  shortName: props.data.shortName
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateCustomer(customer.value)

    emit('success', customer.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Update customer" @close="emit('cancel')">
    <template #body>
      <form id="updateCustomer" @submit.prevent="onSubmit">
        <CfInput
          v-model="customer.name"
          label="Name"
          required
        />
        <CfInput
          v-model="customer.shortName"
          label="Short name"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateCustomer" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateCustomer {
  display: grid;
  gap: 1rem;
}
</style>