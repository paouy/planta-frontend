<script setup>
import { ref, computed } from 'vue'
import { incrementProduct } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const qtyIncrement = ref(0)

const qtyNew = computed(() => props.data.qtyAvailable + qtyIncrement.value)

const onSubmit = async () => {
  try {
    isLoading.value = true

    await incrementProduct({
      id: props.data.id,
      value: qtyIncrement.value
    })

    emit('success', {
      id: props.data.id,
      qtyAvailable: qtyNew.value
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
      <form id="incrementProduct" @submit.prevent="onSubmit">
        <CfField
          label="Product"
          type="text"
          :value="props.data.name"
          disabled
        />
        <CfField
          label="Available quantity"
          type="text"
          :suffix="props.data.uom"
          :value="props.data.qtyAvailable"
          disabled
        />
        <CfField
          v-model.number="qtyIncrement"
          label="Adjustment"
          type="number"
          step="any"
          :suffix="props.data.uom"
          required
        />
        <CfField
          label="New quantity"
          type="text"
          :suffix="props.data.uom"
          :value="qtyNew"
          disabled
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="incrementProduct"
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
#incrementProduct {
  display: grid;
  gap: 1rem;
}
</style>