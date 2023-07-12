<script setup>
import { ref, onMounted } from 'vue'
import { updateEquipment } from '../api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
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

onMounted(() => Object.assign(equipment.value, props.data))
</script>

<template>
  <CfDialog title="Edit equipment" @close="emit('cancel')">
    <template #body>
      <form id="updateEquipment" @submit.prevent="onSubmit">
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