<script setup>
import { computed } from 'vue'
import { useCollectionStore } from '../store.js'
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

const { collections } = useCollectionStore()

const options = computed(() => {
  return collections.value
    .filter(({ type }) => props.type.toUpperCase() === type)
    .map(collection => {
      let value = {}

      if (props.keys.length > 1) {
        props.keys.forEach(key => value[key] = collection[key])
      } else {
        value = collection[props.keys.at(0)]
      } 

      return {
        label: collection.name,
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
    label="Collection"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>