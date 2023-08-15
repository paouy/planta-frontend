<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from 'vue-cf-ui'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const categoryTypeOptions = [
  { label: 'Materials', value: 'MATERIALS' },
  { label: 'Products', value: 'PRODUCTS' }
]

const isLoading = ref(false)
const ctx = ref({
  name: '',
  type: ''
})

const invoke = async () => {
  try {
    isLoading.value = true

    const category = await api.category.createOne(ctx.value)

    emit('success', category)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add category" @close="emit('cancel')">
    <template #body>
      <form id="createCategory" @submit.prevent="invoke">
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
      <CfFilledButton type="submit" form="createCategory" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createCategory {
  display: grid;
  gap: 1rem;
}
</style>