<script setup>
import { ref } from 'vue'
import { CfInput, CfFilledButton } from 'vue-cf-ui'
import { useAuth } from '../componsables/auth.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success'])

const { storeSession } = useAuth()

const isLoading = ref(false)
const ctx = ref({
  username: '',
  password: ''
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.auth
      .login(ctx.value)
      .then(storeSession)

    emit('success')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form id="login" @submit.prevent="invoke">
    <CfInput
      v-model="ctx.username"
      label="Username"
      required
    />
    <CfInput
      v-model="ctx.password"
      label="Password"
      type="password"
      required
    />
    <CfFilledButton type="submit" :loading="isLoading">
      Log in
    </CfFilledButton>
  </form>
</template>

<style lang="scss">
#login {
  display: grid;
  gap: 1rem;
}
</style>