<script setup>
import { ref, computed, watch, onBeforeMount } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({ modelValue: Array })

const today = new Date().toLocaleDateString('en-CA')
const daysOptions = [
  { label: 'Previous 7 days', value: 7 },
  { label: 'Previous 30 days', value: 30 },
  { label: 'Previous 90 days', value: 90 },
  { label: 'Custom range', value: 0 }
]

const days = ref(7)

watch(days, value => {
  if (value) {
    emit('update:modelValue', [getPreviousDate(today, value), today])
  }
})

const startDate = computed({
  get: () => props.modelValue[0],
  set: (value) => emit('update:modelValue', [value, props.modelValue[1]])
})
const endDate = computed({
  get: () => props.modelValue[1],
  set: (value) => {
    const start = value === startDate.value
      ? getPreviousDate(value)
      : props.modelValue[0]

    emit('update:modelValue', [start, value])
  }
})
const beforeEndDate = computed(() => getPreviousDate(endDate.value))

const getPreviousDate = (dateString, daysBefore = 1) => {
  const date = new Date(dateString)
  date.setDate(date.getDate() - daysBefore)
  return date.toLocaleDateString('en-CA')
}

onBeforeMount(() => emit('update:modelValue', [getPreviousDate(today, days.value), today]))
</script>

<template>
  <div class="date-range-input">
    <div class="cf-form-control">
      <label v-if="props.label">{{ props.label }}</label>
      <div class="cf-form-control-widget" v-if="days">
        <select v-model="days">
          <option v-for="option in daysOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="cf-form-control-widget" v-else>
        <input
          v-model="startDate"
          type="date"
          :max="beforeEndDate"
        >
        <div>&mdash;</div>
        <input
          v-model="endDate"
          type="date"
          :max="today"
        >
        <button @click="days = 7">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.date-range-input {
  button {
    font-variation-settings: 'FILL' 0, 'wght' 350, 'GRAD' 0, 'opsz' 20;
    padding: 0 0.25rem;
    height: 1.5rem;
  }
}
</style>