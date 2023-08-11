<script setup>
import { ref, computed } from 'vue'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'
import EquipmentSelect from '../../equipment/components/EquipmentSelect.vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from '../../../components/index.js'
import api from '../../../api'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ job: Object })

const productionRecordTypeOptions = computed(() => {
  const options = {
    OPEN: [
      { label: 'Output', value: 'OUTPUT' }
    ],
    IN_PROGRESS: [
      { label: 'Output', value: 'OUTPUT' },
      { label: 'Reject', value: 'REJECT' },
      { label: 'Rework', value: 'REWORK' },
      { label: 'Adjustment', value: 'ADJUSTMENT' }
    ],
    CLOSED: [
      { label: 'Reject', value: 'REJECT' },
      { label: 'Adjustment', value: 'ADJUSTMENT' }
    ]
  }

  return options[props.job.status]
})

const isLoading = ref(false)
const ctx = ref({
  productionOrderId: props.job.productionOrder.id,
  operation: props.job.operation,
  workstation: props.job.workstation,
  equipment: null,
  type: props.job.status === 'OPEN' ? 'OUTPUT' : null,
  qty: null,
  timeTakenMins: null
})

const dialogTitle = computed(() => `Add ${props.job.operation.name.toLowerCase()} record`)
const normalizedJob = computed(()=> `${props.job.productionOrder.publicId} — ${props.job.product.normalizedName}`)

const invoke = async () => {
  try {
    isLoading.value = true

    const productionRecord = await api.productionRecord.createOne(ctx.value)

    emit('success', productionRecord)
    emit('cancel')
  } catch (error) {
    alert(error)

    isLoading.value = false
  }
}
</script>

<template>
  <CfDialog :title="dialogTitle" @close="emit('cancel')">
    <template #body>
      <form id="createProductionRecord" @submit.prevent="invoke">
        <CfInput
          label="Job"
          :value="normalizedJob"
          disabled
        />
        <WorkstationSelect
          v-model="ctx.workstation"
          :operation-id="props.job.operation.id"
          required
        />
        <CfSelect
          v-model="ctx.type"
          label="Type"
          :options="productionRecordTypeOptions"
          required
        />
        <EquipmentSelect
          v-model="ctx.equipment"
          :operation-id="props.job.operation.id"
          required
        />
        <CfInput
          v-model.number="ctx.qty"
          label="Quantity"
          type="number"
          step="any"
          required
        />
        <CfInput
          v-model.number="ctx.timeTakenMins"
          label="Duration"
          suffix="mins"
          type="number"
          step="any"
          required
          v-if="['OUTPUT', 'REWORK'].includes(ctx.type)"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton type="submit" form="createProductionRecord" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </template>
  </CfDialog>
</template>

<style lang="scss">
#createProductionRecord {
  display: grid;
  gap: 1rem;
}
</style>