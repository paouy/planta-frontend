<script setup>
import { ref } from 'vue'
import { addMaterial } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import CollectionSelect from '../../collection/components/CollectionSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const material = ref({
  name: '',
  uom: '',
  collection: {}
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedMaterial = await addMaterial(material.value)

    emit('success', addedMaterial)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add material" @close="emit('cancel')">
    <template #body>
      <form id="addMaterial" @submit.prevent="onSubmit">
        <CollectionSelect
          v-model="material.collection"
          type="materials"
        />
        <CfField
          v-model="material.name"
          label="Name"
          type="text"
          required
        />
        <CfField
          v-model="material.uom"
          label="UOM"
          type="text"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addMaterial"
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
#addMaterial {
  display: grid;
  gap: 1rem;
}
</style>