<script setup>
import { ref, computed } from 'vue'
import { CfInput, CfSelect, CfFilledButton, CfOutlinedButton } from 'vue-cf-ui'
import { EquipmentSelect } from '../../equipment/index.js'
import { Metafield } from '../../metafield/index.js'
import { OperationSelect } from '../../operation/index.js'
import { WorkerSelect } from '../../worker/index.js'
import { WorkstationSelect } from '../../workstation/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const date = ref(null)
const operation = ref(null)
const metafields = ref([])
const jobOptions = ref([])
const lineItems = ref([{
  date: null,
  productionOrderId: null,
  workstation: { id: null },
  worker: { id: null },
  equipment: { id: null },
  type: null,
  qty: null,
  timeTakenMins: null,
  meta: {}
}])

const typeOptions = computed(() => {
  const options = [
    { label: 'Output', value: 'OUTPUT' },
    { label: 'Reject', value: 'REJECT' }
  ]

  return operation.value?.allowsRework
    ? [...options, { label: 'Rework', value: 'REWORK' }]
    : options
})

const filteredMetafields = computed(() => metafields.value.filter(({ resource }) => resource.includes(operation.value?.id)))

const filteredJobOptions = computed(() => jobOptions.value.filter(({ operationId }) => operation.value?.id === operationId))

const tableColumnCount = computed(() => {
  const baseCount = operation.value?.hasEquipment ? 8 : 7
  const metafieldCount = filteredMetafields.value.length
  
  return baseCount + metafieldCount
})

const isAddLineItemAllowed = computed(() => {
  const hasOptions = filteredJobOptions.value.some(option => !option.disabled)
  const hasEmptyLineItem = lineItems.value.some(({ productionOrderId }) => productionOrderId === null)

  return hasOptions && !hasEmptyLineItem
})

const addLineItem = () => lineItems.value.push({
  date: null,
  productionOrderId: null,
  workstation: { id: null },
  worker: { id: null },
  equipment: { id: null },
  type: null,
  qty: null,
  timeTakenMins: null,
  meta: {}
})

const removeLineItem = (index) => lineItems.value.splice(index, 1)

const clearLineItems = () => lineItems.value = [{
  date: null,
  productionOrderId: null,
  workstation: { id: null },
  worker: { id: null },
  equipment: { id: null },
  type: null,
  qty: null,
  timeTakenMins: null,
  meta: {}
}]

const invoke = async () => {
  try {
    isLoading.value = true

    let timestamp

    if (date.value !== new Date().toLocaleDateString('en-CA')) {
      timestamp = Date.parse(`${date.value}T00:00:00+08:00`)
    }

    const ctx = lineItems.value.map(lineItem => {
      const { date, equipment, meta, ...data } = lineItem

      for (const [id, field] of Object.entries(meta)) {
        if (field.value === '' || field.value === null) delete meta[id]
      }

      const productionRecord = {
        operation: { id: operation.value.id },
        meta: Object.keys(meta).length ? meta : null,
        equipment: equipment?.id || null,
        ...data
      }

      if (timestamp) {
        productionRecord.timestamp = timestamp
      }

      return productionRecord
    })

    await api.productionRecord.create(ctx)

    emit('success', operation.value)
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

api.job.getAll().then(data => {
  const jobs = data.filter(job => {
    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
    const qtyDemand = job.qtyInput - job.qtyShortfall

    return !job.operation.isBatch && job.workstation && qtyDemand > qtyMade
  })

  jobOptions.value = jobs.map(job => ({
    label: `${job.productionOrder.publicId} — ${job.product.normalizedName}`,
    value: job.productionOrder.id,
    operationId: job.operation.id
  }))
})

api.metafield.getAll({ resource: 'OPERATION' }).then(data => metafields.value = data)
</script>

<template>
  <form class="createProductionRecords" @submit.prevent="invoke">
    <fieldset>
      <CfInput
        v-model="date"
        label="Date"
        type="date"
        :max="new Date().toLocaleDateString('en-CA')"
        required
      />
      <OperationSelect
        v-model="operation"
        :keys="['id', 'name', 'allowsRework', 'hasEquipment']"
        :is-batch="false"
        @change="clearLineItems"
      />
    </fieldset>
    <table>
      <colgroup>
        <col v-for="n in tableColumnCount">
      </colgroup>
      <tbody>
        <tr v-for="(_, index) in lineItems" :key="operation?.id + String(index)">
          <td>
            <CfSelect
              v-model="lineItems[index].productionOrderId"
              label="Job"
              :options="filteredJobOptions"
              required
            />
          </td>
          <td>
            <CfSelect
              v-model="lineItems[index].type"
              label="Type"
              :options="typeOptions"
              required
            />
          </td>
          <td>
            <WorkstationSelect
              v-model="lineItems[index].workstation.id"
              :operation-id="operation?.id"
              :keys="['id']"
            />
          </td>
          <td>
            <WorkerSelect
              v-model="lineItems[index].worker.id"
              :keys="['id']"
            />
          </td>
          <td v-if="operation?.hasEquipment">
            <EquipmentSelect
              v-model="lineItems[index].equipment.id"
              :operation-id="operation?.id"
              :keys="['id']"
            />
          </td>
          <td>
            <CfInput
              v-model.number="lineItems[index].qty"
              label="Quantity"
              type="number"
              step="any"
              min="0"
              required
            />
          </td>
          <td>
            <CfInput
              v-model.number="lineItems[index].timeTakenMins"
              label="Duration"
              suffix="mins"
              type="number"
              step="any"
              min="0"
              :disabled="!['OUTPUT', 'REWORK'].includes(lineItems[index].type)"
            />
          </td>
          <td v-for="field in filteredMetafields" :key="field.id">
            <Metafield
              v-model="lineItems[index].meta[field.id]"
              :data="field"
            />
          </td>
          <td>
            <CfFilledButton
              color="gray"
              @click="removeLineItem(index)"
              v-if="lineItems.length > 1"
            >
              <span></span>
            </CfFilledButton>
          </td>
        </tr>
      </tbody>
    </table>
    <CfOutlinedButton
      :disabled="!isAddLineItemAllowed"
      @click="addLineItem"
    >
      Add job
    </CfOutlinedButton>
    <hr>
    <footer>
      <CfFilledButton type="submit" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
    </footer>
  </form>
</template>

<style lang="scss">
.createProductionRecords {
  fieldset {
    display: grid;
    gap: 1rem;
    max-width: 18rem;
    margin-bottom: 2rem;
  }

  table {
    margin-bottom: 1.5rem;
    width: 100%;

    td {
      vertical-align: bottom;
    }

    tr {
      display: grid;
      gap: 0.5rem;
    }

    button {
      span {
        &::before {
          display: block;
          content: '';
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M256-213.847 213.847-256l224-224-224-224L256-746.153l224 224 224-224L746.153-704l-224 224 224 224L704-213.847l-224-224-224 224Z"/></svg>') center;
          background-size: contain;
          height: 1.25rem;
          width: 1.25rem;
        }
      }
    }
  }

  hr {
    border-top: 1px solid var(--cf-gray-8);
    margin: 1rem 0 1.5rem;
  }

  footer {
    display: flex;
    gap: 0.5rem;
    flex-direction: row-reverse;
    justify-content: end;
    align-items: center;

    p {
      margin-right: auto;
    }
  }
}

@media (min-width: 880px) {
  .createProductionRecords {
    table {
      table-layout: fixed;

      col {
        // &:nth-child(4),
        // &:nth-child(5),
        // &:nth-child(6) {
        //   width: 12%;
        // }

        &:last-child {
          width: 3.75rem;
        }
      }

      tr {
        display: table-row;

        &:hover,
        &:focus-within {
          background: var(--cf-gray-9);
        }
      }

      td {
        padding: 0.5rem;

        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
        }
      }
    }
  }
}
</style>