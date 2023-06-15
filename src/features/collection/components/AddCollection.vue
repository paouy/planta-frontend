<script setup>
import { ref } from 'vue'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import { addCollection } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const collectionTypeOptions = [
  { label: 'Materials', value: 'MATERIALS' },
  { label: 'Products', value: 'PRODUCTS' }
]

const isLoading = ref(false)
const collection = ref({
  name: '',
  type: ''
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedCollection = await addCollection(collection.value)

    emit('success', addedCollection)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add collection" @close="emit('cancel')">
    <template #body>
      <form id="addCollection" @submit.prevent="onSubmit">
        <CfField
          v-model="collection.name"
          type="text"
          label="Name"
          required
        />
        <CfField
          v-model="collection.type"
          type="select"
          label="Type"
          :options="collectionTypeOptions"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addCollection"
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
#addCollection {
  display: grid;
  gap: 1rem;
}
</style>