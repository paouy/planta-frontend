<script setup>
import { computed } from 'vue'
import { CfInput, CfSelect } from 'vue-cf-ui'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: Object,
  data: Object
})

const uomOptions = {
  'DIMENSION': ['mm', 'cm', 'm', 'in', 'ft', 'yd'],
  'VOLUME': ['ml', 'L', 'm³', 'fl oz', 'pt', 'qt', 'gal'],
  'WEIGHT': ['mg', 'g', 'kg', 'oz', 'lb']
}

const requiresUom = computed(() => ['DIMENSION', 'VOLUME', 'WEIGHT'].includes(props.data.type))

const formControl = computed(() =>
  props.data.attributes.some(({ type }) => type === 'OPTIONS')
    ? CfSelect
    : CfInput
)

const attributes = computed(() => {
  const type = ['TEXT', 'DATE'].includes(props.data.type) ? props.data.type : 'number'
  const attributes = {}

  props.data.attributes.forEach(({ type, value }) => attributes[type.toLowerCase()] = value)

  if (requiresUom.value) {
    attributes.step = 'any'
  }

  return { ...attributes, type }
})

const computedUom = computed({
  get: () => props.modelValue?.uom,
  set: (value) => emit('update:modelValue', { value: props.modelValue.value, uom: value })
})

const computedValue = computed({
  get: () => props.modelValue?.value,
  set: (value) => emit('update:modelValue', requiresUom.value ? { value, uom: computedUom.value } : { value })
})
</script>

<template>
  <div class="metafield">
    <label>{{ props.data.name }}</label>
    <div class="metafield-widget">
      <component
        v-model="computedValue"
        :is="formControl"
        :type="attributes.type"
        :min="attributes.min"
        :max="attributes.max"
        :step="attributes.step"
        :options="attributes.options"
      />
      <CfSelect
        v-model="computedUom"
        :options="uomOptions[props.data.type]"
        :required="!!computedValue"
        v-if="requiresUom"
      />
    </div>
  </div>
</template>

<style lang="scss">
.metafield {
  display: grid;
  gap: 0.25rem;

  label {
    color: var(--cf-gray-3);
    font-weight: 600;
    font-size: 0.875rem;
  }

  &-widget {
    display: flex;
    gap: 0.5rem;

    :nth-child(2) {
      max-width: 30%;
    }
  }
}
</style>