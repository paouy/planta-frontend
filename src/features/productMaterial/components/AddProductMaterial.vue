<script setup>
import { ref, computed, onMounted } from 'vue'
import { addProductMaterial } from '../api/index.js'
import { getMaterials } from '../../material/api/index.js'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from '../../../components/index.js'
import CategorySelect from '../../category/components/CategorySelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({
  productId: String,
  productMaterials: Array
})

const isLoading = ref(false)
const materials = ref([])
const category = ref({ id: '' })

const productMaterial = ref({
  productId: props.productId,
  reference: {},
  qty: null
})

const materialOptions = computed(() => {
  const referenceIds = props.productMaterials.map(({ reference }) => reference.id)

  return materials.value
    .filter(material => !referenceIds.includes(material.id))
    .filter(material => material.category.id === category.value.id)
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

onMounted(async () => materials.value = await getMaterials())
</script>

<template>
  <CfDialog title="Add product material" @close="emit('cancel')">
    <template #body>
      <form id="addProductMaterial" @submit.prevent="onSubmit">
        <CategorySelect
          v-model="category"
          type="materials"
        />
        <CfSelect
          v-model="productMaterial.reference"
          label="Name"
          :options="materialOptions"
          required
        />
        <CfInput
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