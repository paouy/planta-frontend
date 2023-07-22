<script setup>
import { ref, watchEffect } from 'vue'
import { addOperationBatchReport } from '../api/index.js'
import { CfField, CfSwitch, CfFilledButton } from '../../../components'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ operationBatch: Object })

const pseudoRecords = ref([])
const isLoading = ref(false)

const onSubmit = async () => {
  const { operation, workstation, equipment } = props.operationBatch

  const report = {
    id: props.operationBatch.id,
    operationId: operation.id,
    workstationId: workstation.id,
    equipmentId: equipment.id,
    productionRecords: []
  }

  pseudoRecords.value.forEach(pseudoRecord => {
    const { productionOrderId, qtyOutput, qtyReject, requiresRework } = pseudoRecord

    report.productionRecords.push({
      productionOrderId,
      type: 'OUTPUT',
      qty: qtyOutput,
      timeTakenMins: operation.timePerCycleMins
    })

    if (qtyReject) {
      report.productionRecords.push({
        productionOrderId,
        type: 'REJECT',
        qty: qtyReject,
        requiresRework: requiresRework
      })

      if (!requiresRework) {
        report.productionRecords.push({
          productionOrderId,
          type: 'SHORTFALL',
          qty: qtyReject
        })
      }
    }
  })

  try {
    isLoading.value = true

    await addOperationBatchReport(report)

    emit('success')
    emit('cancel')
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

watchEffect(() => {
  pseudoRecords.value = props.operationBatch.jobs.map(job => {
    return {
      productionOrderId: job.productionOrder.id,
      qtyOutput: job.qtyExpected - job.qtyProduced,
      qtyReject: 0,
      requiresRework: false
    }
  })
})
</script>

<template>
  <form class="addOperationBatchReport" @submit.prevent="onSubmit">
    <table>
      <colgroup>
        <col v-for="n in 4">
        <col v-if="props.operationBatch.operation.allowsRework">
      </colgroup>
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Output</th>
          <th>Reject</th>
          <th v-if="props.operationBatch.operation.allowsRework"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(job, index) in props.operationBatch.jobs" :key="index">
          <td>
            <CfField
              :value="job.productionOrder.friendlyId"
              type="text"
              disabled
            />
          </td>
          <td>
            <CfField
              :value="job.productName"
              type="text"
              disabled
            />
          </td>
          <td>
            <CfField
              :value="pseudoRecords[index].qtyOutput - pseudoRecords[index].qtyReject"
              type="number"
              disabled
            />
          </td>
          <td>
            <CfField
              v-model.number="pseudoRecords[index].qtyReject"
              type="number"
              step="any"
              min="0"
              :max="job.qtyExpected"
              required
            />
          </td>
          <td v-if="props.operationBatch.operation.allowsRework">
            <CfSwitch
              label="Rework"
              v-model="pseudoRecords[index].requiresRework"
              v-if="pseudoRecords[index].qtyReject"
            />
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
      <p>{{ `Adding a report will close the batch${props.operationBatch.operation.allowsRework
          ? ', while incomplete jobs will be available for assignment'
          : ' and its jobs'}.` }}</p>
    </footer>
  </form>
</template>

<style lang="scss">
.addOperationBatchReport {
  table {
    width: 100%;
  }

  col:nth-child(5) {
    width: 8rem;
  }

  th {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--cf-gray-3);
  }

  tr > * {
    padding: 0.5rem;

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
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
</style>