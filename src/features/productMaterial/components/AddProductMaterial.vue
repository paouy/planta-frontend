<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { addProductMaterial } from '../api/index.js'
import { getCollections } from '../../collection/api/index.js'
import { getMaterials } from '../../material/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({
  productId: String,
  productMaterials: Array
})

const isLoading = ref(false)
const collectionOptions = ref([])
const materials = []

const collectionId = ref('')
const productMaterial = ref({
  productId: props.productId,
  reference: {},
  qty: null
})

const materialOptions = computed(() => {
  const referenceIds = props.productMaterials.map(({ reference }) => reference.id)

  return materials.value
    .filter(({ id }) => !referenceIds.includes(id))
    .filter(({ collection }) => collection.id === collectionId.value)
    .map(material => ({ label: material.name, value: material }))
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedProductMaterial = await addProductMaterial(productMaterial.value)

    emit('success', addedProductMaterial)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onBeforeMount(async () => {
  const [collections, _materials] =
    await Promise.all([getCollections(), getMaterials()])

  collectionOptions.value = collections
    .filter(collection => collection.type === 'MATERIALS')
    .map(({ id, name }) => ({ label: name, value: id }))

  materials.value = _materials
})
</script>

<template>
  <CfDialog
    title="Add product material"
    @close="emit('cancel')"
    v-if="collectionOptions.length"
  >
    <template #body>
      <form id="addProductMaterial" @submit.prevent="onSubmit">
        <CfField
          v-model="collectionId"
          label="Collection"
          type="select"
          :options="collectionOptions"
          required
        />
        <CfField
          v-model="productMaterial.reference"
          label="Name"
          type="select"
          :options="materialOptions"
          required
        />
        <CfField
          v-model="productMaterial.qty"
          label="Quantity"
          type="number"
          step="any"
          :suffix="productMaterial.reference?.uom"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addProductMaterial"
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
#addProductMaterial {
  display: grid;
  gap: 1rem;
}
</style>