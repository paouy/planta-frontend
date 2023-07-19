<script setup>
import { ref, watchEffect } from 'vue'
import { CfField, CfSwitch, CfFilledButton } from '../../../components'

const emit = defineEmits(['success', 'cancel'])

const props = defineProps({ operationBatch: Object })

const pseudoRecords = ref([])

watchEffect(() => {
  pseudoRecords.value = props.operationBatch.jobs.map(() => {
    return {
      qtyOutput: 0,
      qtyReject: 0,
      requireRework: false
    }
  })
})
</script>

<template>
  <form class="addOperationBatchReport" @submit.prevent>
    <table>
      <colgroup>
        <col v-for="n in 5">
      </colgroup>
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Output</th>
          <th>Reject</th>
          <th></th>
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
              v-model.number="pseudoRecords[index].qtyOutput"
              type="number"
              step="any"
              min="0"
              :max="job.qtyExpected"
              required
            />
          </td>
          <td>
            <CfField
              v-model.number="pseudoRecords[index].qtyReject"
              type="number"
              step="any"
              min="0"
              :max="job.qtyExpected - pseudoRecords[index].qtyOutput"
              :disabled="job.qtyExpected === pseudoRecords[index].qtyOutput"
              required
            />
          </td>
          <td>
            <CfSwitch
              label="Rework"
              v-model="pseudoRecords[index].requireRework"
              v-if="pseudoRecords[index].qtyReject"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <hr>
    <footer>
      <CfFilledButton type="submit">
        Save
      </CfFilledButton>
      <CfFilledButton color="gray" @click="emit('cancel')">
        Cancel
      </CfFilledButton>
      <p>Adding a report will close the batch, while incomplete jobs will be available for assignment.</p>
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