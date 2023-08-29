<script setup>
import { ref } from 'vue'
import { CfInput, CfSelect, CfFilledButton, CfOutlinedButton } from 'vue-cf-ui'
import { EquipmentSelect } from '../../equipment/index.js'
import { WorkerSelect } from '../../worker/index.js'
import { WorkstationSelect } from '../../workstation/index.js'
import api from '../../../api/index.js'

const emit = defineEmits(['dismiss'])

const isLoading = ref(false)
const jobOptions = ref([])
const workerId = ref(null)
const lineItems = ref([
  {
    productionOrder: null,
    workstation: null,
    equipment: null,
    qtyOutput: null,
    qtyReject: null,
    qtyRework: null,
    timeTakenMins: null,
    meta: null
  }
])

const addLineItem = () => {
  lineItems.value.push({
    productionOrder: null,
    workstation: null,
    equipment: null,
    qtyOutput: null,
    qtyReject: null,
    qtyRework: null,
    timeTakenMins: null,
    meta: null
  })
}

const removeLineItem = (index) => lineItems.value.splice(index, 1)

const invoke = async () => {
  try {
    isLoading.value = true

    const ctx = []

    lineItems.value.forEach(async (lineItem) => {
      const { productionOrder, qtyOutput, qtyReject, qtyRework, ...data } = lineItem

      await api.job.updateOne({
        id: productionOrder.jobId,
        workstation: data.workstation
      })

      ctx.push({
        productionOrderId: productionOrder.id,
        operation: { id: productionOrder.operationId },
        worker: { id: workerId.value },
        type: 'OUTPUT',
        qty: qtyOutput + qtyReject,
        ...data
      })

      if (qtyReject) {
        ctx.push({
          productionOrderId: productionOrder.id,
          operation: { id: productionOrder.operationId },
          worker: { id: workerId.value },
          type: 'REJECT',
          qty: qtyReject,
          ...data
        })
      }

      if (qtyRework) {
        ctx.push({
          productionOrderId: productionOrder.id,
          operation: { id: productionOrder.operationId },
          worker: { id: workerId.value },
          type: 'REWORK',
          qty: qtyRework,
          ...data
        })
      }
    })

    await api.productionRecord.create(ctx)

    emit('dismiss')
  } catch (error) {
    alert(error)
  } finally {
    isLoading.value = false
  }
}

api.job.getAll().then(data => {
  jobOptions.value = data
    .filter(({ operation }) => !operation.isBatch)
    .map(({ id, productionOrder, product, operation }) => ({
      label: `${operation.name} — ${productionOrder.publicId} — ${product.normalizedName}`,
      value: {
        id: productionOrder.id,
        operationId: operation.id,
        jobId: id
      }
    }))
})
</script>

<template>
  <form class="createWorkerReport" @submit.prevent="invoke">
    <fieldset>
      <CfInput
        label="Date"
        :value="new Date().toLocaleDateString('en-CA')"
        disabled
      />
      <WorkerSelect
        v-model="workerId"
        :keys="['id']"
      />
    </fieldset>
    <table>
      <colgroup>
        <col v-for="n in 7">
      </colgroup>
      <tbody>
        <tr v-for="(_, index) in lineItems" :key="index">
          <td>
            <CfSelect
              v-model="lineItems[index].productionOrder"
              label="Job"
              :options="jobOptions"
              required
            />
          </td>
          <td>
            <WorkstationSelect
              :operation-id="lineItems[index].productionOrder?.operationId"
              v-model="lineItems[index].workstation"
            />
          </td>
          <td>
            <EquipmentSelect
              :operation-id="lineItems[index].productionOrder?.operationId"
              v-model="lineItems[index].equipment"
              :required="false"
            />
          </td>
          <td>
            <CfInput
              v-model="lineItems[index].qtyOutput"
              label="Output"
              type="number"
              min="0"
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
    <CfOutlinedButton @click="addLineItem">
      Add job
    </CfOutlinedButton>
    <hr>
    <footer>
      <CfFilledButton type="submit" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('dismiss')">
        Cancel
      </CfFilledButton>
    </footer>
  </form>
</template>

<style lang="scss">
.createWorkerReport {
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
  .createWorkerReport {
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