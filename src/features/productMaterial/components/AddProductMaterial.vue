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
const productMaterialQty = ref(null)
const collectionOptions = ref([])
const collection = ref({
  id: '',
  name: ''
})
const materialOptions = ref([])
const material = ref({
  id: '',
  uom: ''
})

const currentProductMaterialIds = computed(() => {
  return props.productMaterials.map(({ materialId }) => materialId)
})

const computedMaterialOptions = computed(() => {
  return materialOptions.value
    .filter(({ value }) => !currentProductMaterialIds.value.includes(value.id))
    .filter(({ value }) => value.collectionId === collection.value.id)
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedProductMaterial = await addProductMaterial({
      productId: props.productId,
      materialId: material.value.id,
      qty: productMaterialQty.value
    })

    emit('success', {
      ...addedProductMaterial,
      name: material.value.name,
      uom: material.value.uom,
      collectionName: collection.value.name
    })
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onBeforeMount(async () => {
  const [collections, materials] =
    await Promise.all([getCollections(), getMaterials()])

  collectionOptions.value = collections
    .filter(collection => collection.type === 'MATERIALS')
    .map(collection => ({ label: collection.name, value: collection }))

  materialOptions.value = materials
    .map(material => ({ label: material.name, value: material }))
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
          v-model="collection"
          type="select"
          label="Collection"
          :options="collectionOptions"
          required
        />
        <CfField
          v-model="material"
          type="select"
          label="Name"
          :options="computedMaterialOptions"
          required
        />
        <CfField
          v-model="productMaterialQty"
          type="number"
          step="any"
          label="Quantity"
          :suffix="material.uom"
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