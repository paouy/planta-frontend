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
    { label: 'Rework', value: 'REWORK', disabled: props.job.qtyReject < 1 }
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
const date = ref(new Date().toLocaleDateString('en-CA'))
const meta = ref(null)

const dialogTitle = computed(() => `Add ${props.job.operation.name.toLowerCase()} record`)
const normalizedJob = computed(()=> `${props.job.productionOrder.publicId} — ${props.job.product.normalizedName}`)
const maxQty = computed(() => {
  const qtyMade = props.job.qtyOutput - props.job.qtyReject + props.job.qtyRework

  const qty = {
    'OUTPUT': props.job.qtyInput - qtyMade,
    'REJECT': qtyMade,
    'REWORK': props.job.qtyReject
  }

  return qty[ctx.value.type]
})

const invoke = async () => {
  try {
    isLoading.value = true

    if (date.value !== new Date().toLocaleDateString('en-CA')) {
      ctx.value.timestamp = Date.parse(`${date.value}T00:00:00+08:00`)
    }

    if (metafields.value.length && Object.values(meta.value).some(field => field.value !== '' && field.value !== null)) {
      ctx.value.meta = {}

      for (const [id, field] of Object.entries(meta.value)) {
        if (field.value !== '' && field.value !== null) ctx.value.meta[id] = field
      }
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
    meta.value = {}

    data.forEach(({ id, type }) => {
      const metadata = { value: null } 
      
      if (['DIMENSION', 'VOLUME', 'WEIGHT'].includes(type)) {
        metadata.uom = null
      }

      meta.value[id] = metadata
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
        <CfInput
          label="Workstation"
          :value="props.job.workstation.name"
          disabled
        />
        <CfInput
          v-model="date"
          label="Date"
          type="date"
          :max="new Date().toLocaleDateString('en-CA')"
          required
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
          :helper="ctx.type ? `Maximum of ${maxQty.toLocaleString()}` : null"
          type="number"
          step="any"
          min="1"
          :max="maxQty"
          required
        />
        <CfInput
          v-model.number="ctx.timeTakenMins"
          label="Duration"
          suffix="mins"
          type="number"
          step="any"
          min="0"
          v-if="['OUTPUT', 'REWORK'].includes(ctx.type)"
        />
        <Metafield
          v-for="field in metafields"
          v-model="meta[field.id]"
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