<script setup>
import { computed } from 'vue'
import { useOperationStore } from '../store.js'
import { CfChoiceList } from '../../../components/index.js'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const { operations } = useOperationStore()

const choices = computed(() => {
  return operations.value.map(({ id, name, seq }) => ({
    label: name,
    value: { id, name, seq }
  }))
})

const computedValue = computed({
  get: () => props.modelValue.map(operation => {
    const { seq } = operations.value.find(({ id }) => operation.id === id)
    return { seq, ...operation }
  }),
  set: (value) => {
    const sortedValue = value
      .sort((a, b) => a.seq - b.seq)
      .map(({ seq, ...operation }) => operation)

    emit('update:modelValue', sortedValue)
  }
})
</script>

<template>
  <CfChoiceList
    v-model="computedValue"
    label="Operations"
    multiple
    :choices="choices"
  />
</template>