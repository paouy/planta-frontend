<script setup>
import { computed } from 'vue'
import { useWorkstationStore } from '../store.js'
import { CfField } from '../../../components/index.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Object,
  operationId: String,
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
    label="Workstation"
    type="select"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>