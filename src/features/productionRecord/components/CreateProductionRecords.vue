<script setup>
import { ref, computed } from 'vue'
import { CfInput, CfSelect, CfFilledButton, CfOutlinedButton } from 'vue-cf-ui'
import { EquipmentSelect } from '../../equipment/index.js'
import { OperationSelect } from '../../operation/index.js'
import { WorkerSelect } from '../../worker/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])

const isLoading = ref(false)
const jobOptions = ref([])
const operation = ref(null)
const lineItems = ref([
  {
    job: null,
    worker: null,
    equipment: null,
    qtyOutput: null,
    qtyReject: null,
    qtyRework: null,
    timeTakenMins: null,
    meta: null
  }
])

const filteredJobOptions = computed(() => {
  const selectedJobIds = lineItems.value
    .filter(({ job }) => job !== null)
    .map(({ job }) => job.id)

  const options = jobOptions.value
    .filter(({ value }) => operation.value?.id === value.operationId)
    .map(option => ({ ...option, disabled: selectedJobIds.includes(option.value.id) }))

  return options
})

const isAddLineItemAllowed = computed(() => {
  const hasOptions = filteredJobOptions.value.some(option => !option.disabled)
  const hasEmptyLineItem = lineItems.value.some(({ job }) => job === null)

  return hasOptions && !hasEmptyLineItem
})

const addLineItem = () => lineItems.value.push({
  job: null,
  worker: null,
  equipment: null,
  qtyOutput: null,
  qtyReject: null,
  qtyRework: null,
  timeTakenMins: null,
  meta: null
})

const removeLineItem = (index) => lineItems.value.splice(index, 1)

const clearLineItems = () => lineItems.value = [{
  job: null,
  worker: null,
  equipment: null,
  qtyOutput: null,
  qtyReject: null,
  qtyRework: null,
  timeTakenMins: null,
  meta: null
}]

const invoke = async () => {
  try {
    isLoading.value = true

    const ctx = []

    lineItems.value.forEach(lineItem => {
      const { job, qtyOutput, qtyReject, qtyRework, ...data } = lineItem

      ctx.push({
        productionOrderId: job.productionOrderId,
        operation: { id: job.operationId },
        workstation: { id: job.workstationId },
        type: 'OUTPUT',
        qty: qtyOutput + qtyReject,
        ...data
      })

      if (qtyReject) {
        ctx.push({
          productionOrderId: job.productionOrderId,
          operation: { id: job.operationId },
          workstation: { id: job.workstationId },
          type: 'REJECT',
          qty: qtyReject,
          ...data
        })
      }

      if (qtyRework && operation.value?.allowsRework) {
        ctx.push({
          productionOrderId: job.productionOrderId,
          operation: { id: job.operationId },
          workstation: { id: job.workstationId },
          type: 'REWORK',
          qty: qtyRework,
          ...data
        })
      }
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
  jobOptions.value = data
    .filter(job => {
      const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
      const qtyDemand = job.qtyInput - job.qtyShortfall

      return !job.operation.isBatch && job.workstation && qtyDemand > qtyMade
    })
    .filter(({ operation, workstation }) => !operation.isBatch && workstation !== null)
    .map(({ id, productionOrder, product, operation, workstation, qtyInput }) => ({
      label: `${operation.name} — ${productionOrder.publicId} — ${product.normalizedName}`,
      value: {
        id,
        productionOrderId: productionOrder.id,
        operationId: operation.id,
        workstationId: workstation.id,
        qtyInput
      }
    }))
})
</script>

<template>
  <form class="createProductionRecords" @submit.prevent="invoke">
    <fieldset>
      <CfInput
        label="Date"
        :value="new Date().toLocaleDateString('en-CA')"
        disabled
      />
      <OperationSelect
        v-model="operation"
        :keys="['id', 'name', 'allowsRework']"
        :is-batch="false"
        @change="clearLineItems"
      />
    </fieldset>
    <table>
      <colgroup>
        <col v-for="n in 7">
      </colgroup>
      <tbody>
        <tr v-for="(_, index) in lineItems" :key="operation?.id + String(index)">
          <td>
            <CfSelect
              v-model="lineItems[index].job"
              label="Job"
              :options="filteredJobOptions"
              required
            />
          </td>
          <td>
            <WorkerSelect v-model="lineItems[index].worker"/>
          </td>
          <td>
            <EquipmentSelect
              v-model="lineItems[index].equipment"
              :operation-id="operation?.id"
              :required="false"
            />
          </td>
          <td>
            <CfInput
              v-model="lineItems[index].qtyOutput"
              label="Output"
              type="number"
              min="0"
              :max="lineItems[index].job?.qtyInput"
            />
          </td>
          <td>
            <CfInput
              v-model="lineItems[index].qtyReject"
              label="Reject"
              type="number"
              min="0"
            />
          </td>
          <td>
            <CfInput
              v-model="lineItems[index].qtyRework"
              label="Rework"
              type="number"
              min="0"
              v-if="operation?.allowsRework"
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
    width: 100%;
    margin-bottom: 1.5rem;

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

  td {
    vertical-align: bottom;
  }

  tr {
    display: grid;
    gap: 0.5rem;
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
    }

    col {
      &:nth-child(4),
      &:nth-child(5),
      &:nth-child(6) {
        width: 12%;
      }

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
</style>