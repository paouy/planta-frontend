<script setup>
import { ref, computed } from 'vue'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'
import EquipmentSelect from '../../equipment/components/EquipmentSelect.vue'
import { CfDialog, CfField, CfFilledButton } from '../../../components/index.js'
import { addProductionRecord } from '../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ job: Object })

const productionRecordTypeOptions = computed(() => {
  return props.job.status !== 'CLOSED'
    ? [
        { label: 'Output', value: 'OUTPUT' },
        { label: 'Reject', value: 'REJECT' },
        { label: 'Rework', value: 'REWORK' },
        { label: 'Adjustment', value: 'ADJUSTMENT' }
    ]
    : [
      { label: 'Reject', value: 'REJECT' },
      { label: 'Adjustment', value: 'ADJUSTMENT' }
    ]
})

const isLoading = ref(false)
const productionRecord = ref({
  productionOrderId: props.job.productionOrder.id,
  operationId: props.job.operation.id,
  workstationId: props.job.workstation.id,
  equipmentId: null,
  type: null,
  qty: null,
  timeTakenMins: null
})

const dialogTitle = computed(() => `Add ${props.job.operation.name.toLowerCase()} record`)

const onSubmit = async () => {
  try {
    isLoading.value = true

    const fixedProductionRecord = {
      ...productionRecord.value,
      qty: productionRecord.value.type === 'REJECT'
        ? productionRecord.value.qty * -1
        : productionRecord.value.qty
    }

    const addedProductionRecord = await addProductionRecord(fixedProductionRecord)

    emit('success', addedProductionRecord)
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
      <form id="addProductionRecord" @submit.prevent="onSubmit">
        <CfField
          label="Job"
          type="text"
          :value="`${props.job.productionOrder.friendlyId} — ${props.job.productName}`"
          disabled
        />
        <WorkstationSelect
          v-model="productionRecord.workstationId"
          :operation-id="props.job.operation.id"
          :keys="['id']"
          required
        />
        <EquipmentSelect
          v-model="productionRecord.equipmentId"
          :operation-id="props.job.operation.id"
          :keys="['id']"
          required
        />
        <CfField
          v-model="productionRecord.type"
          label="Type"
          type="select"
          :options="productionRecordTypeOptions"
          required
        />
        <CfField
          v-model.number="productionRecord.qty"
          label="Quantity"
          type="number"
          step="any"
          required
        />
        <CfField
          v-model.number="productionRecord.timeTakenMins"
          label="Duration"
          suffix="mins"
          type="number"
          step="any"
          required
          v-if="['OUTPUT', 'REWORK'].includes(productionRecord.type)"
        />
      </form>
    </template>
    <template #footer>
      <CfFilledButton
        type="submit"
        form="addProductionRecord"
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
#addProductionRecord {
  display: grid;
  gap: 1rem;
}
</style>