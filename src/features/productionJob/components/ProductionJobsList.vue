<script setup>
const props = defineProps({ data: Array })
</script>

<template>
  <pre>{{ props.data }}</pre>
</template>