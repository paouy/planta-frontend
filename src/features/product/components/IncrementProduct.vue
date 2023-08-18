<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  qty: 0
})

const result = computed(() => props.data.qtyAvailable + ctx.value.qty)

const onSubmit = async () => {
  try {
    isLoading.value = true

    await api.product.increment(ctx.value)

    const product = {
      id: props.data.id,
      qtyAvailable: result.value
    }

    emit('success', product)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Adjust available quantity" :persist="isLoading" @close="emit('cancel')"
  >
    <template #body>
      <form id="incrementProduct" @submit.prevent="onSubmit">
        <CfInput
          label="Product"
          :value="props.data.name"
          disabled
        />
        <CfInput
          label="Available"
          :suffix="props.data.uom"
          :value="props.data.qtyAvailable"
          disabled
        />
        <CfInput
          v-model.number="ctx.qty"
          label="Adjustment"
          type="number"
          step="any"
          :suffix="props.data.uom"
          required
        />
        <CfInput
          label="Result"
          :value="result"
          :suffix="props.data.uom"
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