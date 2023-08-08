<script setup>
import { computed } from 'vue'
import { useCategoryStore } from '../store.js'
import { CfSelect } from '../../../components/index.js'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: [Object, String],
  type: String,
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

const { categories } = useCategoryStore()

const options = computed(() => {
  return categories.value
    .filter(({ type }) => props.type.toUpperCase() === type)
    .map(category => {
      let value = {}

      if (props.keys.length > 1) {
        props.keys.forEach(key => value[key] = category[key])
      } else {
        value = category[props.keys.at(0)]
      } 

      return {
        label: category.name,
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
    label="Category"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>