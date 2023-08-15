<script setup>
import { computed } from 'vue'
import { useWorkerStore } from '../store.js'
import { CfSelect } from '../../../components/index.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [Object, String],
  defaultOption: Boolean,
  keys: {
    type: Array,
    default: () => ['id', 'publicId', 'firstName', 'lastName']
  },
  disabled: Boolean,
  required: {
    type: Boolean,
    default: true
  }
})

const { workers } = useWorkerStore()

const options = computed(() => {
  return workers.value
    .map(worker => {
      let value = {}

      if (props.keys.length > 1) {
        props.keys.forEach(key => value[key] = worker[key])
      } else {
        value = worker[props.keys.at(0)]
      } 

      return {
        label: `${worker.lastName}, ${worker.firstName} — ${worker.publicId}`,
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
</script>

<template>
  <CfSelect
    v-model="computedValue"
    label="Worker"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>