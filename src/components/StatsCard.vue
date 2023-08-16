<script setup>
const props = defineProps({
  title: String,
  description: String,
  data: Array
})
</script>

<template>
  <div class="statsCard">
    <h3>{{ props.title }}</h3>
    <p>{{ props.description }}</p>
    <ul>
      <li v-for="item in props.data" :key="item.label">
        <span v-if="item.to">
          <RouterLink :to="item.to">
            {{ item.label }}
          </RouterLink>
          <span class="material-symbols-outlined">open_in_new</span>
        </span>
        <span v-else>{{ item.label }}</span>
        <div>{{ item.value }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.statsCard {
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

      span {
        color: var(--cf-blue-4);
        margin-left: 0.25rem;
        position: relative;
        top: 2px;
      }

      a {
        color: var(--cf-blue-4);
        text-decoration: underline;
        text-underline-offset: 0.25rem;
      }
    }

    div {
      font-size: 1.5rem;
      font-weight: 600;
    }
  }
}
</style>