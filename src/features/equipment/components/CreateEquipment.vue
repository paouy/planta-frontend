<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const ctx = ref({
  name: '',
  operationIds: []
})

const invoke = async () => {
  try {
    isLoading.value = true

    const equipment = await api.equipment.createOne(ctx.value)

    emit('success', equipment)
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
      <form id="createEquipment" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
        <OperationChoiceList v-model="ctx.operationIds"/>
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createEquipment" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createEquipment {
  display: grid;
  gap: 1rem;
}
</style>