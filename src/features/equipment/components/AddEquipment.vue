<script setup>
import { ref, onBeforeMount } from 'vue'
import { addEquipment } from '../api/index.js'
import { getOperations } from '../../operation/api/index.js'
import { CfDialog, CfField, CfChoiceList, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const operationChoices = ref([])

const equipment = ref({
  name: '',
  operationIds: []
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedWorkstation = await addEquipment(equipment.value)

    const operations = addedWorkstation.operationIds.map(operationId => {
      const { label } = operationChoices.value.find(
        choice => choice.value === operationId
      )

      return {
        id: operationId,
        name: label
      }
    })

    delete addedWorkstation.operationsIds

    emit('success', { ...addedWorkstation, operations })
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onBeforeMount(async () => {
  const operations = await getOperations()

  operationChoices.value = operations
    .map(operation => ({ label: operation.name, value: operation.id }))
})
</script>

<template>
  <CfDialog
    title="Add equipment"
    @close="emit('cancel')"
    v-if="operationChoices.length"
  >
    <template #body>
      <form id="addEquipment" @submit.prevent="onSubmit">
        <CfField
          v-model="equipment.name"
          type="text"
          label="Name"
          required
        />
        <CfChoiceList
          v-model="equipment.operationIds"
          label="Operations"
          :choices="operationChoices"
          multiple
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addEquipment"
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
#addEquipment {
  display: grid;
  gap: 1rem;
}
</style>