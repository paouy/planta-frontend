<script setup>
import { ref, computed, onMounted } from 'vue'
import { CfDialog, CfSelect, CfInput, CfFilledButton } from 'vue-cf-ui'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({
  operation: Object,
  job: Object,
  unassignedJobs: {
    type: Array,
    default: () => []
  },
  operationBatches: {
    type: Array,
    default: () => []
  }
})

const isLoading = ref(false)
const ctx = ref({
  id: '',
  workstation: null
})

const jobOptions = computed(() => {
  const options = props.unassignedJobs.map(job => {
    const label = `${job.productionOrder.publicId} — ${job.product.normalizedName}`
    const value = { id: job.id, workstation: null }

    return { label, value }
  })

  return options
})

const operationBatchesOptions = computed(() => {
  const options = props.operationBatches
    .filter(({ status }) => status === 'OPEN')
    .map(({ publicId, schedule, id: value }) => {
      const label = `${publicId} — ${schedule}`
      
      return { label, value }
    })

  return options
})

const dialogTitle = computed(() => {
  const action = props.job ? 'Reassign' : 'Assign'
  const normalizedOperation = props.operation.name.toLowerCase()
  const target = props.operation.isBatch ? 'batch' : 'workstation'

  return `${action} ${normalizedOperation} job to a ${target}`
})

const isSubmitDisabled = computed(() => {
  return props.job ? props.job.workstation.id === ctx.value.workstation?.id : false
})

const setWorkstation = ({ data }) => {
  const { workstation } = props.operationBatches.find(({ id }) => data === id)
  ctx.value.workstation = workstation
}

const invoke = async () => {
  try {
    isLoading.value = true

    if (props.operation.isBatch) {
      await api.operationBatchJob.createOne(ctx.value)
    }

    await api.job.updateOne(ctx.value)

    await emit('success', ctx.value)

    ctx.value = {
      id: '',
      workstation: null
    }

    if (!props.unassignedJobs.length) {
      emit('cancel')
    }
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (props.job) {
    ctx.value = {
      id: props.job.id,
      workstation: props.job.workstation
    }
  }
})
</script>

<template>
  <CfDialog :title="dialogTitle" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="assignJob" @submit.prevent="invoke">
        <CfSelect
          v-model="ctx"
          label="Job"
          :options="jobOptions"
          required
          v-if="!props.job"
        />
        <CfInput
          label="Job"
          :value="`${props.job.productionOrder.publicId} — ${props.job.product.normalizedName}`"
          disabled
          v-else
        />
        <WorkstationSelect
          v-model="ctx.workstation"
          :operation-id="operation.id"
          required
          v-if="!props.operation.isBatch"
        />
        <CfSelect
          v-model="ctx.operationBatchId"
          label="Batch"
          :options="operationBatchesOptions"
          required
          @input="setWorkstation"
          v-else
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="assignJob" :loading="isLoading" :disabled="isSubmitDisabled">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style>
#assignJob {
  display: grid;
  gap: 1rem;
}
</style>