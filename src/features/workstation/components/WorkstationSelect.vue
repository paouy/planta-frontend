<script setup>
import { computed } from 'vue'
import { useWorkstationStore } from '../store.js'
import { CfSelect } from 'vue-cf-ui'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [Object, String],
  operationId: String,
  defaultOption: Boolean,
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

const { workstations } = useWorkstationStore()

const options = computed(() => {
  return workstations.value
    .filter(({ operation }) => operation.id === props.operationId)
    .map(workstation => {
      let value = {}

      if (props.keys.length > 1) {
        props.keys.forEach(key => value[key] = workstation[key])
      } else {
        value = workstation[props.keys.at(0)]
      } 

      return {
        label: workstation.name,
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
    label="Workstation"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>