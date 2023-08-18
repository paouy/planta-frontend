<script setup>
import { ref, computed, onMounted } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import { useAuth } from '../componsables/auth.js'
import api from '../../../api/index.js'

const emit = defineEmits(['dismiss'])
const props = defineProps({ user: Object })

const { session } = useAuth()

const isLoading = ref(false)
const ctx = ref({
  newPassword: '',
  password: ''
})

const isSelfServe = computed(() => {
  return props.user?.id === session.value.user.id || !props.user
})

const passwordLabel = computed(() => {
  if (session.value.user.isAdmin) {
    if (props.user) {
      return 'Enter your password'
    } else {
      return 'Old password'
    }
  } else {
    return 'Old password'
  }
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.auth.changePassword(ctx.value)

    emit('dismiss')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { if (props.user) ctx.value.id = props.user.id })
</script>

<template>
  <CfDialog :title="`Change ${isSelfServe ? 'your' : `${props.user.firstName}'s`} password`" @close="emit('dismiss')">
    <template #body>
      <form id="changePassword" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.password"
          :label="isSelfServe ? 'Old password' : 'Your password'"
          type="password"
          required
        />
        <CfInput
          v-model="ctx.newPassword"
          :label="isSelfServe ? 'New password' : `${props.user.firstName}'s new password`"
          type="password"
          helper="Must be at least 14 characters"
          minlength="14"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="changePassword" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('dismiss')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#changePassword {
  display: grid;
  gap: 1rem;
}
</style>