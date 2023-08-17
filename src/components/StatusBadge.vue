<script setup>
import { computed } from 'vue'

const props = defineProps({ data: String })

const normalizedStatus = computed(() => {
  const snakeToSentence = (snakeCase) => snakeCase.charAt(0).toUpperCase() + snakeCase.slice(1).toLowerCase().replace(/_/g, ' ')
  return snakeToSentence(props.data)
})

const rootClasses = computed(() => {
  const colors = {
    IN_PROGRESS: 'green',
    PAUSED: 'gold',
    CLOSED: 'blue',
    CANCELLED: 'orange',
    CONFIRMED: 'green',
    PARTIALLY_FULFILLED: 'violet',
    FULFILLED: 'blue',
    CANCELLED_BY_CUSTOMER: 'orange',
    CANCELLED_BY_MANUFACTURER: 'orange'
  }

  return {
    'status-badge': true,
    [`status-badge--${colors[props.data]}`]: props.data !== 'OPEN'
  }
})
</script>

<template>
  <div :class="rootClasses">
    {{ normalizedStatus }}
  </div>
</template>

<style lang="scss">
.status-badge {
  color: var(--text);
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 3.125rem;
  background: var(--bg);
  width: fit-content;
  --text: var(--cf-gray-2);
  --bg: var(--cf-gray-8);

  &--green {
    --text: var(--cf-green-2);
    --bg: var(--cf-green-8);
  }

  &--gold {
    --text: var(--cf-gold-2);
    --bg: var(--cf-gold-8);
  }

  &--violet {
    --text: var(--cf-violet-2);
    --bg: var(--cf-violet-8);
  }

  &--blue {
    --text: var(--cf-blue-2);
    --bg: var(--cf-blue-8);
  }

  &--orange {
    --text: var(--cf-orange-2);
    --bg: var(--cf-orange-8);
  }
}
</style>