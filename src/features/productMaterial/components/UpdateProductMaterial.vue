<script setup>
import { ref } from 'vue'
import { updateProductMaterial } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const productMaterial = ref({
  id: props.data.id,
  qty: props.data.qty
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateProductMaterial(productMaterial.value)

    emit('success', { ...props.data, qty: productMaterial.value.qty })
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog
    title="Update product material"
    @close="emit('cancel')"
  >
    <template #body>
      <form id="updateProductMaterial" @submit.prevent="onSubmit">
        <CfField
          v-model="props.data.collectionName"
          type="text"
          label="Collection"
          disabled
        />
        <CfField
          v-model="props.data.name"
          type="text"
          label="Name"
          disabled
        />
        <CfField
          v-model="productMaterial.qty"
          type="number"
          step="any"
          label="Quantity"
          :suffix="props.data.uom"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="updateProductMaterial"
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
#updateProductMaterial {
  display: grid;
  gap: 1rem;
}
</style>