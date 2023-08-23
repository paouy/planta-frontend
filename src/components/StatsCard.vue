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
          <span></span>
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
    grid-template-columns: repeat(5, minmax(8rem, 1fr));
    white-space: nowrap;
    margin-top: 1rem;
    overflow-x: auto;

    li {
      border-right: 1px solid var(--cf-gray-7);
      padding-right: 1rem;

      &:last-child {
        border-right: none;
      }
    }

    span {
      display: flex;
      color: var(--cf-gray-2);
      font-size: 0.875rem;

      span {
        margin-left: 0.25rem;
        position: relative;
        top: 2px;

        &::before {
          display: block;
          content: '';
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="%230051c3" height="24" viewBox="0 -960 960 960" width="24"><path d="M212.309-140.001q-30.308 0-51.308-21t-21-51.308v-535.382q0-30.308 21-51.308t51.308-21h252.305V-760H212.309q-4.616 0-8.463 3.846-3.846 3.847-3.846 8.463v535.382q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846h535.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-252.305h59.999v252.305q0 30.308-21 51.308t-51.308 21H212.309Zm176.46-206.615-42.153-42.153L717.847-760H560v-59.999h259.999V-560H760v-157.847L388.769-346.616Z"/></svg>') center;
          background-size: contain;
          height: 1rem;
          width: 1rem;
        }
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