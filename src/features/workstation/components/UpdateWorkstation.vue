<script setup>
import { ref, onMounted } from 'vue'
import { CfDialog, CfInput, CfFilledButton } from 'vue-cf-ui'
import OperationSelect from '../../operation/components/OperationSelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ data: Object })

const isLoading = ref(false)
const ctx = ref({
  id: '',
  name: '',
  operation: {}
})

const invoke = async () => {
  try {
    isLoading.value = true

    await api.workstation.updateOne(ctx.value)

    emit('success', ctx.value)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}

onMounted(() => Object.assign(ctx.value, props.data))
</script>

<template>
  <CfDialog title="Edit workstation" @close="emit('cancel')">
    <template #body>
      <form id="updateWorkstation" @submit.prevent="invoke">
        <OperationSelect v-model="ctx.operation"/>
        <CfInput
          v-model="ctx.name"
          label="Name"
          required
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="updateWorkstation" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#updateWorkstation {
  display: grid;
  gap: 1rem;
}
</style>