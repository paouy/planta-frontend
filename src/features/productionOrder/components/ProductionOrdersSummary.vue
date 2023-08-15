<script setup>
import { computed } from 'vue'

const props = defineProps({
  productionOrders: Array,
  releasedCount: Number
})

const summary = computed(() => {
  const count = props.productionOrders.reduce((value, { status }) => {
    value[status] = (value[status] || 0) + 1
    return value
  }, {})

  const normalzedStatuses = ['Open', 'In progress', 'Paused', 'Closed']

  const summary = normalzedStatuses.map(status => {
    return {
      label: status,
      value: count[status.replace(' ', '_').toUpperCase()] || 0
    }
  })

  return summary
})
</script>

<template>
  <div class="productionOrderSummary">
    <h3>Summary</h3>
    <p>There are {{ props.productionOrders.length }} production orders.</p>
    <ul>
      <li v-for="item in summary" :key="item.label">
        <span>{{ item.label }}</span>
        <div>{{ item.value }}</div>
      </li>
      <li>
        <span>Released</span>
        <div>{{ props.releasedCount }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.productionOrderSummary {
  padding: 1.5rem 1rem;
  border: 1px solid var(--cf-gray-7);
  border-radius: 0.3125rem;
  margin: 1rem 0 2.5rem 0;

  h3 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  ul {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(5, 1fr);
    margin-top: 1rem;

    li {
      border-right: 1px solid var(--cf-gray-7);

      &:last-child {
        border-right: none;
      }
    }

    span {
      color: var(--cf-gray-2);
      font-size: 0.875rem;
    }

    div {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
}
</style>