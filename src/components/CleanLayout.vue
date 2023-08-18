<script setup>
import { onMounted } from 'vue'

onMounted(() => document.body.dataset.layout = 'clean')
</script>

<template>
  <header></header>
  <main>
    <RouterView/>
  </main>
</template>

<style lang="scss">
body[data-layout="clean"] {
  header {
    border-bottom: 1px solid var(--cf-gray-8);
    height: 3.875rem;
  }

  main {
    display: flex;
    justify-content: center;
    padding: 1rem;
  }
}

@media (min-width: 880px) {
  body[data-layout="clean"] {
    main {
      padding: 2rem
    }
  }
}
</style>