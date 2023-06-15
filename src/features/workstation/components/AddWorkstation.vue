<script setup>
import { ref, onBeforeMount } from 'vue'
import { addWorkstation } from '../api/index.js'
import { getOperations } from '../../operation/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const operationOptions = ref([])

const workstation = ref({
  name: '',
  operationId: ''
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    const addedWorkstation = await addWorkstation(workstation.value)

    const operationName = operationOptions.value
      .find(({ value }) => value === workstation.value.operationId)
      .label

    emit('success', { ...addedWorkstation, operationName })
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onBeforeMount(async () => {
  const operations = await getOperations()

  operationOptions.value = operations
    .map(operation => ({ label: operation.name, value: operation.id}))
})
</script>

<template>
  <CfDialog
    title="Add workstation"
    @close="emit('cancel')"
    v-if="operationOptions.length"
  >
    <template #body>
      <form id="addWorkstation" @submit.prevent="onSubmit">
        <CfField
          v-model="workstation.operationId"
          type="select"
          label="Operation"
          :options="operationOptions"
          required
        />
        <CfField
          v-model="workstation.name"
          type="text"
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