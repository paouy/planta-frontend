<script setup>
import { ref, onMounted } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import CategorySelect from '../../category/components/CategorySelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: '',
  sku: '',
  name: '',
  uom: '',
  category: {}
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await api.material.updateOne(ctx.value)

    const material = {
      ...ctx.value,
      normalizedName: `[${ctx.value.sku}] ${ctx.value.name}`
    }

    emit('success', material)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onMounted(() => Object.assign(ctx.value, props.data))
</script>

<template>
  <CfDialog title="Update material" @close="emit('cancel')">
    <template #body>
      <form id="updateMaterial" @submit.prevent="onSubmit">
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
      <CfFilledButton type="submit" form="updateMaterial" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateMaterial {
  display: grid;
  gap: 1rem;
}
</style>