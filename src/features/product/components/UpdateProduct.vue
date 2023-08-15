<script setup>
import { ref, onMounted } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import CategorySelect from '../../category/components/CategorySelect.vue'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: '',
  sku: '',
  name: '',
  uom: '',
  category: {},
  operationIds: []
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.product.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => Object.assign(ctx.value, props.data))
</script>

<template>
  <CfDialog title="Edit product" @close="emit('cancel')">
    <template #body>
      <form id="updateProduct" @submit.prevent="invoke">
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
      <CfFilledButton type="submit" form="updateProduct" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateProduct {
  display: grid;
  gap: 1rem;
}
</style>