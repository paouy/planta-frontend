<script setup>
import { computed, onMounted } from 'vue'
import { useOperationStore } from '../store.js'
import { CfSelect } from 'vue-cf-ui'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: [Object, String],
  defaultOption: Boolean,
  label: {
    type: String,
    default: 'Operation'
  },
  keys: {
    type: Array,
    default: () => ['id', 'name']
  },
  disabled: Boolean,
  required: {
    type: Boolean,
    default: true
  }
})

const { operations } = useOperationStore()

const options = computed(() => {
  return operations.value.map(operation => {
    let value = {}

    if (props.keys.length > 1) {
      props.keys.forEach(key => value[key] = operation[key])
    } else {
      value = operation[props.keys.at(0)]
    } 

    return {
      label: operation.name,
      value
    }
  })
})

const computedValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

onMounted(() => {
  if (props.defaultOption) {
    const firstOption = options.value.at(0)

    emit('update:modelValue', firstOption.value)
  }
})
</script>

<template>
  <CfSelect
    v-model="computedValue"
    :label="props.label"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>