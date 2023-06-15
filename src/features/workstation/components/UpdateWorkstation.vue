<script setup>
import { ref, onBeforeMount } from 'vue'
import { updateWorkstation } from '../api/index.js'
import { getOperations } from '../../operation/api/index.js'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const operationOptions = ref([])

const workstation = ref({
  id: '',
  name: '',
  operationId: ''
})

const onSubmit = async () => {
  try {
    isLoading.value = true

    await updateWorkstation(workstation.value)

    emit('success', workstation.value)
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

  workstation.value = {
    id: props.data.id,
    name: props.data.name,
    operationId: props.data.operationId
  }
})
</script>

<template>
  <CfDialog
    title="Edit workstation"
    @close="emit('cancel')"
    v-if="operationOptions.length"  
  >
    <template #body>
      <form id="updateWorkstation" @submit.prevent="onSubmit">
        <CfField
          v-model="workstation.operationId"
          type="select"
          label="Operation"
          :options="operationOptions"
          disabled
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
        form="updateWorkstation"
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
#updateWorkstation {
  display: grid;
  gap: 1rem;
}
</style>