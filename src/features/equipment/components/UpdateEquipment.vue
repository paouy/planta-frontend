<script setup>
import { ref, onBeforeMount } from 'vue'
import { updateEquipment } from '../api/index.js'
import { getOperations } from '../../operation/api/index.js'
import { CfDialog, CfField, CfChoiceList, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const operationChoices = ref([])

const equipment = ref({
  id: '',
  name: '',
  operations: []
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateEquipment(equipment.value)

    emit('success', equipment.value)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onBeforeMount(async () => {
  const operations = await getOperations()

  operationChoices.value = operations
    .map(({ id, name }) => ({ label: name, value: { id, name } }))

  equipment.value = {
    id: props.data.id,
    name: props.data.name,
    operations: props.data.operations
  }
})
</script>

<template>
  <CfDialog
    title="Edit equipment"
    @close="emit('cancel')"
    v-if="operationChoices.length"
  >
    <template #body>
      <form id="updateEquipment" @submit.prevent="onSubmit">
        <CfField
          v-model="equipment.name"
          type="text"
          label="Name"
          required
        />
        <CfChoiceList
          v-model="equipment.operations"
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