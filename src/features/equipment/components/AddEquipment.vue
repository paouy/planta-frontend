<script setup>
import { ref } from 'vue'
import { addEquipment } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const equipment = ref({
  name: '',
  operations: []
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedEquipment = await addEquipment(equipment.value)

    emit('success', addedEquipment)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add equipment" @close="emit('cancel')">
    <template #body>
      <form id="addEquipment" @submit.prevent="onSubmit">
        <CfField
          v-model="equipment.name"
          label="Name"
          type="text"
          required
        />
        <OperationChoiceList v-model="equipment.operations"/>
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