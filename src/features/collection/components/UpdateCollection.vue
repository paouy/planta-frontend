<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from '../../../components/index.js'
import { updateCollection } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const collectionTypeOptions = [
  { label: 'Materials', value: 'MATERIALS' },
  { label: 'Products', value: 'PRODUCTS' }
]

const isLoading = ref(false)
const collection = ref({
  id: props.data.id,
  name: props.data.name,
  type: props.data.type
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateCollection(collection.value)

    emit('success', collection.value)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Edit collection" @close="emit('cancel')">
    <template #body>
      <form id="updateCollection" @submit.prevent="onSubmit">
        <CfInput
          v-model="collection.name"
          label="Name"
          required
        />
        <CfSelect
          v-model="collection.type"
          label="Type"
          :options="collectionTypeOptions"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="updateCollection"
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
#updateCollection {
  display: grid;
  gap: 1rem;
}
</style>