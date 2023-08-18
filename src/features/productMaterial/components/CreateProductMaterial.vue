<script setup>
import { ref, computed, onMounted } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from 'vue-cf-ui'
import CategorySelect from '../../category/components/CategorySelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({
  productId: String,
  productMaterials: Array
})

const isLoading = ref(false)
const materials = ref([])
const categoryId = ref(null)
const ctx = ref({
  productId: props.productId,
  material: {},
  qty: null
})

const materialOptions = computed(() => {
  const materialIds = props.productMaterials.map(({ material }) => material.id)

  const filteredMaterials = materials.value
    .filter(({ id }) => !materialIds.includes(id))
    .filter(({ category }) => categoryId.value === category.id)
  
  const options = filteredMaterials.map(({ id, normalizedName, category, uom }) => {
    return {
      label: normalizedName,
      value: {
        id,
        normalizedName,
        uom,
        categoryName: category.name
      }
    }
  })

  return options
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.productMaterial.createOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => materials.value = await api.material.getAll())
</script>

<template>
  <CfDialog title="Add product material" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createProductMaterial" @submit.prevent="invoke">
        <CategorySelect
          v-model="categoryId"
          type="materials"
          :keys="['id']"
        />
        <CfSelect
          v-model="ctx.material"
          label="Name"
          :options="materialOptions"
          required
        />
        <CfInput
          v-model="ctx.qty"
          label="Quantity"
          type="number"
          step="any"
          :suffix="ctx.material?.uom"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createProductMaterial" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createProductMaterial {
  display: grid;
  gap: 1rem;
}
</style>