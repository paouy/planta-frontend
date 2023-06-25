<script setup>
import { computed } from 'vue'

const props = defineProps({ data: Array })

const summary = computed(() => {
  const summary = props.data.reduce((count, { status }) => {
    count[status] = (count[status] || 0) + 1

    return count
  }, {})

  const allStatuses = ['OPEN', 'IN_PROGRESS', 'PAUSED', 'BLOCKED']

  allStatuses.forEach(status => {
    summary[status] = summary[status] || 0
  })

  return summary
})
</script>

<template>
  <div class="productionOrderSummary">
    <h3>Summary</h3>
    <p>There are {{ props.data.length }} production orders.</p>
    <ul>
      <li>
        <span>Open</span>
        <div>{{ summary['OPEN'] }}</div>
      </li>
      <li>
        <span>In progress</span>
        <div>{{ summary['IN_PROGRESS'] }}</div>
      </li>
      <li>
        <span>Paused</span>
        <div>{{ summary['PAUSED'] }}</div>
      </li>
      <li>
        <span>Blocked</span>
        <div>{{ summary['BLOCKED'] }}</div>
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