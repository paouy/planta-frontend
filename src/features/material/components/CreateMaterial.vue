<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import CategorySelect from '../../category/components/CategorySelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const ctx = ref({
  sku: '',
  name: '',
  uom: '',
  category: {}
})

const invoke = async () => {
  try {
    isLoading.value = true

    const material = await api.material.createOne(ctx.value)

    emit('success', material)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add material" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createMaterial" @submit.prevent="invoke">
        <CategorySelect
          v-model="ctx.category"
          type="materials"
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
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createMaterial" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createMaterial {
  display: grid;
  gap: 1rem;
}
</style>