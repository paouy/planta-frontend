<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSwitch, CfFilledButton } from 'vue-cf-ui'
import { useAuth } from '../../auth/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const { session } = useAuth()

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  firstName: props.data.firstName,
  lastName: props.data.lastName,
  isAdmin: props.data.isAdmin,
  isDisabled: props.data.isDisabled
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
  <CfDialog title="Update user" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="updateUser" @submit.prevent="invoke">
        <CfInput
          v-model.trim="ctx.firstName"
          label="First name"
          required
        />
        <CfInput
          v-model.trim="ctx.lastName"
          label="Last name"
          required
        />
        <CfSwitch
          v-model.trim="ctx.isAdmin"
          label="Administrator role"
        />
        <CfSwitch
          v-model="ctx.isDisabled"
          label="Active"
          :true-value="false"
          :false-value="true"
          v-if="props.data.id !== session.user.id"
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