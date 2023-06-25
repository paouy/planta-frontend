<script setup>
import { ref, onBeforeMount } from 'vue'
import { updateMaterial } from '../api/index.js'
import { getCollections } from '../../collection/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const collectionOptions = ref([])

const material = ref({
  id: '',
  name: '',
  uom: '',
  collection: {}
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

onBeforeMount(async () => {
  const collections = await getCollections()

  collectionOptions.value = collections.map(({ id, name }) => {
    return {
      label: name,
      value: { id, name }
    }
  })

  Object.assign(material.value, props.data)
})
</script>

<template>
  <CfDialog
    title="Update material"
    @close="emit('cancel')"
    v-if="collectionOptions.length"
  >
    <template #body>
      <form id="updateMaterial" @submit.prevent="onSubmit">
        <CfField
          v-model="material.collection"
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