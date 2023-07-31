<script setup>
const props = defineProps({ salesOrderId: String })
</script>

<template>
  <pre>{{ props.salesOrderId }}</pre>
</template>