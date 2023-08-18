<script setup>
import { ref, onMounted } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import OperationChoiceList from '../../operation/components/OperationChoiceList.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: '',
  name: '',
  operationIds: []
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.equipment.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => Object.assign(ctx.value, props.data))
</script>

<template>
  <CfDialog title="Edit equipment" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="updateEquipment" @submit.prevent="invoke">
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
        <OperationChoiceList v-model="ctx.operationIds"/>
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateEquipment" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateEquipment {
  display: grid;
  gap: 1rem;
}
</style>