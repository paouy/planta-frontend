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
  return operations.value
    .map(({ id, name }) => ({ label: name, value: { id, name } }))
})

const computedValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
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