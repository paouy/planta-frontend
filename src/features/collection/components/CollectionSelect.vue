<script setup>
import { computed } from 'vue'
import { useCollectionStore } from '../store.js'
import { CfSelect } from '../../../components/index.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Object,
  type: String,
  disabled: Boolean,
  required: {
    type: Boolean,
    default: true
  }
})

const { collections } = useCollectionStore()

const options = computed(() => {
  return collections.value
    .filter(({ type }) => type === props.type.toUpperCase())
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
  <CfSelect
    v-model="computedValue"
    label="Collection"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>