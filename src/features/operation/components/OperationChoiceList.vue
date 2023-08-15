<script setup>
import { computed } from 'vue'
import { useOperationStore } from '../store.js'
import { CfChoiceList } from 'vue-cf-ui'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  keys: {
    type: Array,
    default: () => ['id']
  }
})

const { operations } = useOperationStore()

const choices = computed(() => {
  return operations.value.map(operation => {
    let value = {}

    if (props.keys.length > 1) {
      props.keys.forEach(key => value[key] = operation[key])
    } else {
      value = operation[props.keys[0]]
    } 

    return {
      label: operation.name,
      value
    }
  })
})

const computedValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    const sortedValue = value
      .map(operation => {
        const operationId = typeof operation !== 'object'
          ? operation
          : operation.id

        const { seq } = operations.value.find(({ id }) => operationId === id)

        return [operation, seq]
      })
      .sort((a, b) => a[1] - b[1])
      .map(([operation]) => operation)

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