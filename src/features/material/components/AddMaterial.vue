<script setup>
import { ref, onBeforeMount } from 'vue'
import { addMaterial } from '../api/index.js'
import { getCollections } from '../../collection/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const collectionOptions = ref([])

const material = ref({
  name: '',
  uom: '',
  collection: {
    id:''
  }
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

onBeforeMount(async () => {
  const collections = await getCollections()

  collectionOptions.value = collections
    .filter(collection => collection.type === 'MATERIALS')
    .map(collection => ({ label: collection.name, value: collection.id }))
})
</script>

<template>
  <CfDialog
    title="Add material"
    @close="emit('cancel')"
    v-if="collectionOptions.length"
  >
    <template #body>
      <form id="addMaterial" @submit.prevent="onSubmit">
        <CfField
          v-model="material.collection.id"
          type="select"
          label="Collection"
          :options="collectionOptions"
          required
        />
        <CfField
          v-model="material.name"
          type="text"
          label="Name"
          required
        />
        <CfField
          v-model="material.uom"
          type="text"
          label="Measurement Unit"
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