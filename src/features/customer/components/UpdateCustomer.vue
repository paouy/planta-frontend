<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  name: props.data.name,
  shortName: props.data.shortName
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.customer.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Update customer" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="updateCustomer" @submit.prevent="invoke">
        <CfInput
          v-model.trim="ctx.name"
          label="Name"
          required
        />
        <CfInput
          v-model.trim="ctx.shortName"
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