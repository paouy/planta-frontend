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

const invoke = async () => {
  try {
    isLoading.value = true

    await api.material.increment(ctx.value)

    const material = {
      id: props.data.id,
      qtyAvailable: result.value
    }

    emit('success', material)
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
      <form id="incrementMaterial" @submit.prevent="invoke">
        <CfInput
          :value="props.data.name"
          label="Material"
          disabled
        />
        <CfInput
          :value="props.data.qtyAvailable"
          label="Available"
          :suffix="props.data.uom"
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