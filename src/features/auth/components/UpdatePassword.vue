<script setup>
import { ref, computed, onMounted } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ user: Object })

const isLoading = ref(false)
const repeatPassword = ref('')
const ctx = ref({
  password: ''
})

const repeatPasswordHelper = computed(() => {
  return repeatPassword.value && repeatPassword.value !== ctx.value.password
    ? 'Password does not match'
    : null
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.auth.updatePassword(ctx.value)

    emit('success')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { if (props.user) ctx.value.id = props.user.id })
</script>

<template>
  <CfDialog title="Update password" @close="emit('cancel')">
    <template #body>
      <form id="updatePassword" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.password"
          label="New password"
          helper="Must be at least 14 characters"
          minlength="14"
          required
        />
        <CfInput
          v-model="repeatPassword"
          label="Repeat password"
          :helper="repeatPasswordHelper"
          minlength="14"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updatePassword" :loading="isLoading">
        Update
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updatePassword {
  display: grid;
  gap: 1rem;
}
</style>