<script setup>
import { computed } from 'vue'
import { useEquipmentStore } from '../store.js'
import { CfSelect } from '../../../components/index.js'

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

const { equipments } = useEquipmentStore()

const options = computed(() => {
  return equipments.value
    .filter(({ operations }) => operations.map(({ id }) => id).includes(props.operationId))
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
    label="Equipment"
    :options="options"
    :disabled="props.disabled"
    :required="props.required"
  />
</template>