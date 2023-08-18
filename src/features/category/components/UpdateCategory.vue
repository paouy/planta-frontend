<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ data: Object })
const categoryTypeOptions = [
  { label: 'Materials', value: 'MATERIALS' },
  { label: 'Products', value: 'PRODUCTS' }
]

const isLoading = ref(false)
const ctx = ref({
  id: props.data.id,
  name: props.data.name,
  type: props.data.type
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.category.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Edit category" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="updateCategory" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
        <CfSelect
          v-model="ctx.type"
          label="Type"
          :options="categoryTypeOptions"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateCategory" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateCategory {
  display: grid;
  gap: 1rem;
}
</style>