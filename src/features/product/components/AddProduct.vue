<script setup>
import { ref } from 'vue'
import { addProduct } from '../api/index.js'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import CategorySelect from '../../category/components/CategorySelect.vue'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const product = ref({
  sku: '',
  name: '',
  uom: '',
  category: {},
  operations: []
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedProduct = await addProduct(product.value)

    emit('success', addedProduct)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add product" @close="emit('cancel')">
    <template #body>
      <form id="addProduct" @submit.prevent="onSubmit">
        <CategorySelect
          v-model="product.category"
          type="products"
        />
        <CfInput
          v-model="product.sku"
          label="SKU"
          required
        />
        <CfInput
          v-model="product.name"
          label="Name"
          required
        />
        <CfInput
          v-model="product.uom"
          label="UOM"
          required
        />
        <OperationChoiceList v-model="product.operations"/>
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addProduct"
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
#addProduct {
  display: grid;
  gap: 1rem;
}
</style>