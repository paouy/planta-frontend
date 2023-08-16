<script setup>
import { computed } from 'vue'
import { useEquipmentStore } from '../store.js'
import { CfSelect } from 'vue-cf-ui'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: [Object, String],
  label: {
    type: String,
    default: 'Equipment'
  },
  filtered: {
    type: Boolean,
    default: true
  },
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

const { equipments } = useEquipmentStore()

const options = computed(() => {
  return equipments.value
    .filter(({ operationIds }) => props.filtered ? operationIds.includes(props.operationId) : true)
    .map(equipment => {
      let value = {}

      if (props.keys.length > 1) {
        props.keys.forEach(key => value[key] = equipment[key])
      } else {
        value = equipment[props.keys.at(0)]
      } 

      return {
        label: equipment.name,
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
    :label="props.label"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>