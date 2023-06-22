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
  collectionId: '',
  operationIds: []
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
      .map(collection => ({ label: collection.name, value: collection.id}))

  operationChoices.value = operations
    .map(operation => ({ label: operation.name, value: operation.id }))

  product.value = {
    id: props.data.id,
    sku: props.data.sku,
    name: props.data.name,
    uom: props.data.uom,
    collectionId: props.data.collection.id,
    operationIds: props.data.operations.map(({id}) => id)
  }
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
          v-model="product.collectionId"
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
          v-model="product.operationIds"
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