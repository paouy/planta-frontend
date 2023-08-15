<script setup>
import { ref } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import OperationSelect from '../../operation/components/OperationSelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const ctx = ref({
  name: '',
  operation: {}
})

const invoke = async () => {
  try {
    isLoading.value = true

    const workstation = await api.workstation.createOne(ctx.value)

    emit('success', workstation)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog title="Add workstation" @close="emit('cancel')">
    <template #body>
      <form id="createWorkstation" @submit.prevent="invoke">
        <OperationSelect v-model="ctx.operation"/>
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createWorkstation" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#createWorkstation {
  display: grid;
  gap: 1rem;
}
</style>