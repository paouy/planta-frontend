<script setup>
import { ref, computed } from 'vue'
import { CfDialog, CfInput, CfSelect, CfFilledButton } from 'vue-cf-ui'
import { EquipmentSelect } from '../../equipment/index.js'
import { Metafield } from '../../metafield/index.js'
import { WorkerSelect } from '../../worker/index.js'
import api from '../../../api'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ job: Object, requireEquipment: Boolean })

const productionRecordTypeOptions = computed(() => {
  const allOptions = [
    { label: 'Output', value: 'OUTPUT' },
    { label: 'Reject', value: 'REJECT' },
    { label: 'Rework', value: 'REWORK' }
  ]

  const options = {
    OPEN: [
      { label: 'Output', value: 'OUTPUT' }
    ],
    IN_PROGRESS: allOptions,
    PAUSED: allOptions,
    CLOSED: [
      { label: 'Reject', value: 'REJECT' }
    ]
  }

  return options[props.job.status]
})

const isLoading = ref(false)
const metafields = ref([])
const ctx = ref({
  productionOrderId: props.job.productionOrder.id,
  operation: props.job.operation,
  worker: null,
  workstation: props.job.workstation,
  equipment: null,
  type: props.job.status === 'OPEN' ? 'OUTPUT' : null,
  qty: null,
  timeTakenMins: null,
  meta: null
})

const dialogTitle = computed(() => `Add ${props.job.operation.name.toLowerCase()} record`)
const normalizedJob = computed(()=> `${props.job.productionOrder.publicId} — ${props.job.product.normalizedName}`)
const maxQty = computed(() => {
  const qtyMade = (props.job.qtyOutput - props.job.qtyReject + props.job.qtyRework)

  return ctx.value.type === 'OUTPUT'
    ? props.job.qtyInput - qtyMade
    : production
})

const invoke = async () => {
  try {
    isLoading.value = true

    if (metafields.value.length) {
      metafields.value.forEach(({ id }) => {
        if (!ctx.value.meta[id].value) {
          delete ctx.value.meta[id]
        }
      })
    }

    const productionRecord = await api.productionRecord.create(ctx.value)

    emit('success', productionRecord)
    emit('cancel')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

const setupMetafields = (data) => {
  if (data.length) {
    metafields.value = data
    ctx.value.meta = {}

    data.forEach(({ id, type }) => {
      const meta = { value: null } 
      
      if (['DIMENSION', 'VOLUME', 'WEIGHT'].includes(type)) {
        meta.uom = null
      }

      ctx.value.meta[id] = meta
    })
  }
}

api.metafield
  .getAll({ resource: `OPERATION:${props.job.operation.id}` })
  .then(setupMetafields)
</script>

<template>
  <CfDialog :title="dialogTitle" :persist="isLoading" @close="emit('cancel')">
    <template #body>
      <form id="createProductionRecord" @submit.prevent="invoke">
        <CfInput
          label="Job"
          :value="normalizedJob"
          disabled
        />
        <CfSelect
          v-model="ctx.type"
          label="Type"
          :options="productionRecordTypeOptions"
          required
        />
        <WorkerSelect
          v-model="ctx.worker"
          required
        />
        <EquipmentSelect
          v-model="ctx.equipment"
          :operation-id="props.job.operation.id"
          v-if="props.requireEquipment"
        />
        <CfInput
          v-model.number="ctx.qty"
          label="Quantity"
          type="number"
          step="any"
          :max="maxQty"
          min="1"
          required
        />
        <CfInput
          v-model.number="ctx.timeTakenMins"
          label="Duration"
          suffix="mins"
          type="number"
          step="any"
          v-if="['OUTPUT', 'REWORK'].includes(ctx.type)"
        />
        <Metafield
          v-for="field in metafields"
          v-model="ctx.meta[field.id]"
          :key="field.id"
          :data="field"
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

<style>
#createProductionRecord {
  display: grid;
  gap: 1rem;
}
</style>