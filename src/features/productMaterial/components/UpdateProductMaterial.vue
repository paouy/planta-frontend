<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  productId: props.data.productId,
  material: props.data.material,
  qty: props.data.qty
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.productMaterial.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Update product material" @close="emit('cancel')">
    <template #body>
      <form id="updateProductMaterial" @submit.prevent="invoke">
        <CfInput
          label="Category"
          :value="props.data.material.categoryName"
          disabled
        />
        <CfInput
          label="Name"
          :value="props.data.material.normalizedName"
          disabled
        />
        <CfInput
          v-model="ctx.qty"
          label="Quantity"
          type="number"
          step="any"
          :suffix="props.data.material.uom"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateProductMaterial" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateProductMaterial {
  display: grid;
  gap: 1rem;
}
</style>