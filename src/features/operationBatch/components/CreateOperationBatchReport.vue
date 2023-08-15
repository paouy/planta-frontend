<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useOperationStore } from '../../operation/store.js'
import { CfInput, CfSwitch, CfFilledButton } from '../../../components'
import WorkerSelect from '../../worker/components/WorkerSelect.vue'
import EquipmentSelect from '../../equipment/components/EquipmentSelect.vue'
import api from '../../../api/index.js'

const emit = defineEmits(['success', 'cancel'])
const props = defineProps({ operationBatch: Object, jobs: Array })

const { operations } = useOperationStore()

const isLoading = ref(false)
const lineItems = ref([])
const ctx = ref({
  id: null,
  operation: {
    id: null
  },
  workstation: {
    id: null
  },
  worker: {
    id: null
  },
  equipment: {
    id: null
  },
  productionRecords: []
})

const operation = computed(() => operations.value.find(({ id }) => props.operationBatch.operationId === id))
const footerText = computed(() => {
  const text = operation?.allowsRework
    ? 'while incomplete jobs will be available for assignment'
    : 'and its jobs'

  return `Adding a report will close the batch ${text}.`
})

const invoke = async () => {
  lineItems.value.forEach(lineItem => {
    const { productionOrderId, qtyOutput, qtyReject, requiresRework } = lineItem

    ctx.value.productionRecords.push({
      productionOrderId,
      type: 'OUTPUT',
      qty: qtyOutput,
      timeTakenMins: operation?.timePerCycleMins
    })

    if (qtyReject) {
      ctx.value.productionRecords.push({
        productionOrderId,
        type: 'REJECT',
        qty: qtyReject,
        requiresRework: requiresRework
      })

      if (!requiresRework) {
        ctx.value.productionRecords.push({
          productionOrderId,
          type: 'SHORTFALL',
          qty: qtyReject
        })
      }
    }
  })

  try {
    isLoading.value = true

    await api.operationBatch.createReport(ctx.value)

    emit('success')
    emit('cancel')
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

watchEffect(() => {
  lineItems.value = props.jobs.map(job => {
    const qtyMade = job.qtyOutput - job.qtyReject + job.qtyRework
    
    return {
      productionOrderId: job.productionOrder.id,
      qtyOutput: job.qtyInput - qtyMade,
      qtyReject: 0,
      requiresRework: false
    }
  })

  ctx.value.id = props.operationBatch.id
  ctx.value.operation.id = props.operationBatch.operationId
  ctx.value.workstation.id = props.operationBatch.workstation.id
})
</script>

<template>
  <form class="createOperationBatchReport" @submit.prevent="invoke">
    <fieldset>
      <WorkerSelect
        v-model="ctx.worker.id"
        :keys="['id']"
      />
      <EquipmentSelect
        v-model="ctx.equipment.id"
        :keys="['id']"
        :operation-id="operation?.id"
      />
    </fieldset>
    <table>
      <colgroup>
        <col v-for="n in 3">
        <col v-if="operation?.allowsRework">
      </colgroup>
      <tbody>
        <tr v-for="(job, index) in props.jobs" :key="index">
          <td>
            <CfInput
              label="Job"
              :value="`${job.productionOrder.publicId} — ${job.product.normalizedName}`"
              disabled
            />
          </td>
          <td>
            <CfInput
              label="Output"
              :value="lineItems[index].qtyOutput - lineItems[index].qtyReject"
              type="number"
              disabled
            />
          </td>
          <td>
            <CfInput
              v-model.number="lineItems[index].qtyReject"
              label="Reject"
              type="number"
              step="any"
              min="0"
              :max="job.qtyInput"
              required
            />
          </td>
          <td v-if="operation?.allowsRework">
            <div class="allowsReworkToggle">
              <CfSwitch
                label="Rework"
                v-model="lineItems[index].requiresRework"
                v-if="lineItems[index].qtyReject"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <hr>
    <footer>
      <CfFilledButton type="submit" :loading="isLoading">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" :disabled="isLoading" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
      <p>{{ footerText }}</p>
    </footer>
  </form>
</template>

<style lang="scss">
.createOperationBatchReport {
  fieldset {
    display: grid;
    gap: 1rem;
    max-width: 18rem;
    margin-bottom: 2rem;
  }

  table {
    table-layout: fixed;
    width: 100%;
  }

  col {
    width: 13.5rem;

    &:first-child {
      width: 24rem;
    }
  }

  tr {
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

  .allowsReworkToggle {
    display: flex;
    align-items: center;
    padding-top: 1.5625rem;
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
</style>