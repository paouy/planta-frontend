<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSwitch, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const ctx = ref({
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  isAdmin: false
})

const invoke = async () => {
  try {
    isLoading.value = true

    const user = await api.user.createOne(ctx.value)

    emit('success', user)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add user" @close="emit('cancel')">
    <template #body>
      <form id="createUser" @submit.prevent="invoke">
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
        <CfInput
          v-model="ctx.username"
          label="Username"
          helper="Must be at least 3 characters (letters and numbers only)"
          pattern="[a-zA-Z0-9]{3,}"
          required
        />
        <CfInput
          v-model="ctx.password"
          label="Temporary password"
          helper="Must be at least 14 characters"
          minlength="14"
          required
        />
        <CfSwitch
          v-model="ctx.isAdmin"
          label="Administrator role"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createUser" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createUser {
  display: grid;
  gap: 1rem;
}
</style>