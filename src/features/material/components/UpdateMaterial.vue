<script setup>
import { ref, onMounted } from 'vue'
import { updateMaterial } from '../api/index.js'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import CategorySelect from '../../category/components/CategorySelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const material = ref({
  id: '',
  name: '',
  uom: '',
  category: {}
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateMaterial(material.value)

    emit('success', material.value)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onMounted(() => Object.assign(material.value, props.data))
</script>

<template>
  <CfDialog title="Update material" @close="emit('cancel')">
    <template #body>
      <form id="updateMaterial" @submit.prevent="onSubmit">
        <CategorySelect
          v-model="material.category"
          type="materials"
        />
        <CfInput
          v-model="material.name"
          label="Name"
          required
        />
        <CfInput
          v-model="material.uom"
          label="UOM"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="updateMaterial"
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
#updateMaterial {
  display: grid;
  gap: 1rem;
}
</style>