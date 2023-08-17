<script setup>
import { useRouter } from 'vue-router'
import { Login } from '../features/auth/index.js'

const router = useRouter()
</script>

<template>
  <div>
    <h1 class="login-heading">Log in to your account</h1>
    <div class="login-form">
      <Login @success="router.push({ name: 'SalesOrders' })"/>
    </div>
    <p>Contact your administrator if you cannot access your account.</p>
  </div>
</template>

<style lang="scss">
.login {
  &-heading {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  &-form {
    margin-bottom: 1rem;
    max-width: 26rem;
  }
}
</style>