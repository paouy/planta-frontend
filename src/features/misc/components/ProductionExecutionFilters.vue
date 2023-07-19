<script setup>
import { computed } from 'vue'
import { CfField, CfSwitch } from '../../../components/index.js'
import OperationSelect from '../../operation/components/OperationSelect.vue'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'

const emit = defineEmits([
  'update:operation',
  'update:workstation',
  'update:showAll',
  'update:listType'
])

const props = defineProps({
  operation: Object,
  workstation: Object,
  showAll: Boolean,
  listType: String
})

const operation = computed({
  get: () => props.operation,
  set: (value) => emit('update:operation', value)
})

const workstation = computed({
  get: () => props.workstation,
  set: (value) => emit('update:workstation', value)
})

const showAll = computed({
  get: () => props.showAll,
  set: (value) => emit('update:showAll', value)
})

const listType = computed({
  get: () => props.listType,
  set: (value) => emit('update:listType', value)
})
</script>

<template>
  <div class="productionExecutionFilters">
    <OperationSelect
      v-model="operation"
      :keys="['id', 'name', 'isBatch']"
      @input="workstation = null"
    />
    <CfField
      v-model="listType"
      label="Display"
      type="select"
      :options="[{ label: 'Batches', value: 'BATCH' }, { label: 'Jobs', value: 'JOB' }]"
      required
      v-if="operation.isBatch"
    />
    <WorkstationSelect
      v-model="workstation"
      :operation-id="operation.id"
      :disabled="!operation.id"
      :required="false"
    />
    <CfSwitch
      v-model="showAll"
      label="Show jobs awaiting input"
    />
  </div>
</template>

<style lang="scss">
.productionExecutionFilters {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1.5rem;

  > :not(:last-child) {
    max-width: 12rem;
  }
}
</style>