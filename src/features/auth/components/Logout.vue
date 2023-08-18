<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../componsables/auth.js'
import { useStore } from '../../misc/index.js'

const router = useRouter()
const { clearSession } = useAuth()
const { reset } = useStore()

const invoke = async () => {
  clearSession()

  await router.push({ name: 'Login' })

  reset()
}
</script>

<template>
  <slot :invoke="invoke"></slot>
</template>