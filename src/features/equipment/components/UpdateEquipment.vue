<script setup>
import { ref, onBeforeMount } from 'vue'
import { CfDialog, CfField, CfChoiceList, CfFilledButton } from '../../../components/index.js'
import { updateEquipment } from '../api/index.js'
import { getOperations } from '../../operation/api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const operationChoices = ref([])
const equipment = ref({
  id: props.data.id,
  name: props.data.name,
  operationIds: props.data.operations.map(({ id }) => id)
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateEquipment(equipment.value)

    const operations = equipment.value.operationIds.map(operationId => {
      const { label } = operationChoices.value.find(
        choice => choice.value === operationId
      )

      return {
        id: operationId,
        name: label
      }
    })

    const updatedEquipment = {
      id: equipment.value.id,
      name: equipment.value.name,
      operations
    }

    emit('success', updatedEquipment)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onBeforeMount(async () => {
  const operations = await getOperations()
  operationChoices.value =
    operations.map(operation => ({ label: operation.name, value: operation.id }))
})
</script>

<template>
  <CfDialog title="Update equipment" @close="emit('cancel')">
    <template #body>
      <form id="updateEquipment" @submit.prevent="onSubmit">
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
        form="updateEquipment"
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
#updateEquipment {
  display: grid;
  gap: 1rem;
}
</style>