<script setup>
import { ref, computed } from 'vue'
import { incrementMaterial } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

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
        <CfField
          v-model="props.data.name"
          type="text"
          label="Material"
          disabled
        />
        <CfField
          v-model="props.data.qtyAvailable"
          type="text"
          label="Available Quantity"
          :suffix="props.data.uom"
          disabled
        />
        <CfField
          v-model.number="qtyIncrement"
          type="number"
          label="Adjustment"
          :suffix="props.data.uom"
          required
        />
        <CfField
          v-model="qtyAdjusted"
          type="text"
          label="Adjusted Quantity"
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