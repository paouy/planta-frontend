<script setup>
import { ref } from 'vue'
import { addWorkstation } from '../api/index.js'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import OperationSelect from '../../operation/components/OperationSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const workstation = ref({
  name: '',
  operation: {}
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedWorkstation = await addWorkstation(workstation.value)

    emit('success', addedWorkstation)
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
      <form id="addWorkstation" @submit.prevent="onSubmit">
        <OperationSelect v-model="workstation.operation"/>
        <CfInput
          v-model="workstation.name"
          label="Name"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addWorkstation"
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
#addWorkstation {
  display: grid;
  gap: 1rem;
}
</style>