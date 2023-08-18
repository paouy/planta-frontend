<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSwitch, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  firstName: props.data.firstName,
  lastName: props.data.lastName,
  isAdmin: props.data.isAdmin
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.user.updateOne(ctx.value)

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
  <CfDialog title="Edit user" @close="emit('cancel')">
    <template #body>
      <form id="updateUser" @submit.prevent="invoke">
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
        <CfSwitch
          v-model="ctx.isAdmin"
          label="Administrator role"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateUser" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateUser {
  display: grid;
  gap: 1rem;
}
</style>