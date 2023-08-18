<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import CategorySelect from '../../category/components/CategorySelect.vue'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const ctx = ref({
  sku: '',
  name: '',
  uom: '',
  category: {},
  operationIds: []
})

const invoke = async () => {
  try {
    isLoading.value = true

    const product = await api.product.createOne(ctx.value)

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
  <CfDialog title="Add product" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createProduct" @submit.prevent="invoke">
        <CategorySelect
          v-model="ctx.category"
          type="products"
        />
        <CfInput
          v-model="ctx.sku"
          label="SKU"
          required
        />
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
        <CfInput
          v-model="ctx.uom"
          label="UOM"
          required
        />
        <OperationChoiceList v-model="ctx.operationIds"/>
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createProduct" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createProduct {
  display: grid;
  gap: 1rem;
}
</style>