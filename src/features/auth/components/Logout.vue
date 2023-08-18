<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../componsables/auth.js'

const router = useRouter()
const { clearSession } = useAuth()

const invoke = () => {
  clearSession()
  router.push({ name: 'Login' })
}
</script>

<template>
  <slot :invoke="invoke"></slot>
</template>