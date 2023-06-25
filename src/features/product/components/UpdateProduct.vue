<script setup>
import { ref, onBeforeMount } from 'vue'
import { updateProduct } from '../api/index.js'
import { getCollections } from '../../collection/api/index.js'
import { getOperations } from '../../operation/api/index.js'
import { CfDialog, CfField, CfChoiceList, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const collectionOptions = ref([])
const operationChoices = ref([])
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

    const updatedProduct = await updateProduct(product.value)

    emit('success', updatedProduct)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onBeforeMount(async () => {
  const [collections, operations] =
    await Promise.all([getCollections(), getOperations()])

  collectionOptions.value =
    collections
      .filter(collection => collection.type === 'PRODUCTS')
      .map(({ id, name }) => ({ label: name, value: { id, name } }))

  operationChoices.value = operations
    .map(({ id, name }) => ({ label: name, value: { id, name } }))

  Object.assign(product.value, props.data)
})
</script>

<template>
  <CfDialog
    title="Edit product"
    @close="emit('cancel')"
    v-if="collectionOptions.length && operationChoices.length"
  >
    <template #body>
      <form id="updateProduct" @submit.prevent="onSubmit">
        <CfField
          v-model="product.collection"
          type="select"
          label="Collection"
          :options="collectionOptions"
          required
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
        <CfChoiceList
          v-model="product.operations"
          label="Operations"
          :choices="operationChoices"
          multiple
        />
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