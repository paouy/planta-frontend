<script setup>
import { computed } from 'vue'
import { useOperationStore } from '../store.js'
import { CfField } from '../../../components/index.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Object,
  disabled: Boolean,
  required: {
    type: Boolean,
    default: true
  }
})

const { operations } = useOperationStore()

const options = computed(() => {
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
  <CfField
    v-model="computedValue"
    label="Operation"
    type="select"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>