<script setup>
import { ref, computed } from 'vue'
import { incrementMaterial } from '../api/index.js'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)

const qtyIncrement = ref(0)

const qtyAdjusted = computed(() => {
  return props.data.qtyAvailable + qtyIncrement.value
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await incrementMaterial({
      id: props.data.id,
      value: qtyIncrement.value
    })

    emit('success', {
      id: props.data.id,
      qtyAvailable: qtyAdjusted.value
    })
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog
    title="Adjust available quantity"
    @close="emit('cancel')"
  >
    <template #body>
      <form id="incrementMaterial" @submit.prevent="onSubmit">
        <CfInput
          :value="props.data.name"
          label="Material"
          disabled
        />
        <CfInput
          :value="props.data.qtyAvailable"
          label="Available quantity"
          :suffix="props.data.uom"
          disabled
        />
        <CfInput
          v-model.number="qtyIncrement"
          label="Adjustment"
          type="number"
          step="any"
          :suffix="props.data.uom"
          required
        />
        <CfInput
          :value="qtyAdjusted"
          label="New quantity"
          :suffix="props.data.uom"
          disabled
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="incrementMaterial"
        :loading="isLoading"
      >Save</CfFilledButton>
      <CfFilledButton
        color="gray"
        :disabled="isLoading"
        @click="emit('cancel')"
      >Cancel</CfFilledButton>
    </template>
  </CfDialog>
</template>

<style lang="scss">
#incrementMaterial {
  display: grid;
  gap: 1rem;
}
</style>