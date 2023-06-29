<script setup>
import { ref, onMounted } from 'vue'
import { updateProduct } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import CollectionSelect from '../../collection/components/CollectionSelect.vue'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const product = ref({
  id: '',
  sku: '',
  name: '',
  uom: '',
  collection: {},
  operations: []
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateProduct(product.value)

    emit('success', product.value)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onMounted(() => Object.assign(product.value, props.data))
</script>

<template>
  <CfDialog title="Edit product" @close="emit('cancel')">
    <template #body>
      <form id="updateProduct" @submit.prevent="onSubmit">
        <CollectionSelect
          v-model="product.collection"
          type="products"
        />
        <CfField
          v-model="product.sku"
          type="text"
          label="SKU"
          required
        />
        <CfField
          v-model="product.name"
          type="text"
          label="Name"
          required
        />
        <CfField
          v-model="product.uom"
          type="text"
          label="Measurement Unit"
          required
        />
        <OperationChoiceList v-model="product.operations"/>
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="updateProduct"
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
#updateProduct {
  display: grid;
  gap: 1rem;
}
</style>