<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'h4'
  },
  surtitle: String,
  subtitle: String
})
</script>

<template>
  <div class="cf-header">
    <p v-if="props.surtitle">
      {{ props.surtitle }}
    </p>
    <component :is="props.size">
      <slot></slot>
    </component>
    <p v-if="props.subtitle">
      {{ props.subtitle }}
    </p>
  </div>
</template>

<style lang="scss">
.cf-header {
  * {
    margin-bottom: 0.5rem;

    &:not(p) {
      font-weight: bold;
    }
  }
}
</style>