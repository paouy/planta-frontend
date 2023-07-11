<script setup>
import { computed } from 'vue'
import { CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['view'])

const props = defineProps({
  operation: Object,
  count: {
    type: Number,
    default: 0
  }
})

const isPlural = computed(() => props.count > 1)

const heading = computed(() => {
  return `Unassigned Job${isPlural.value ? 's' : ''} (${props.operation.name})`
})
const description = computed(() => {
  const label = props.count > 1 ? 'jobs' : 'job'
  const assignment = props.operation.type === 'JOB' ? 'workstation' : 'batch'

  return `You need to assign ${props.count} ${label} to a ${assignment}.`
})
</script>

<template>
  <div class="unassignedProductionJobsCallout">
    <h4>{{ heading }}</h4>
    <p>{{ description }}</p>
    <CfFilledButton @click="emit('view')">View</CfFilledButton>
  </div>
</template>

<style lang="scss">
.unassignedProductionJobsCallout {
  display: grid;
  grid-template-columns: auto auto;
  padding: 1rem;
  border: 1px solid var(--cf-gray-7);
  border-radius: 0.5rem;
  background: var(--cf-indigo-9);
  margin-bottom: 1.5rem;

  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    width: 100%;
    flex-shrink: 0;
  }

  > :last-child {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
    justify-self: end;
  }
}
</style>