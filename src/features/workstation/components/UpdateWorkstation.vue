<script setup>
import { ref, onMounted } from 'vue'
import { updateWorkstation } from '../api/index.js'
import { CfDialog, CfInput, CfFilledButton } from '../../../components/index.js'
import OperationSelect from '../../operation/components/OperationSelect.vue'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const workstation = ref({
  id: '',
  name: '',
  operation: {}
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

onMounted(() => Object.assign(workstation.value, props.data))
</script>

<template>
  <CfDialog title="Edit workstation" @close="emit('cancel')">
    <template #body>
      <form id="updateWorkstation" @submit.prevent="onSubmit">
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