<script setup>
import { computed } from 'vue'
import { CfSelect, CfSwitch } from 'vue-cf-ui'
import OperationSelect from '../../operation/components/OperationSelect.vue'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'

const emit = defineEmits([
  'update:operation',
  'update:workstation',
  'update:show',
  'update:list'
])

const props = defineProps({
  operation: Object,
  workstation: Object,
  show: Boolean,
  list: String
})

const operation = computed({
  get: () => props.operation,
  set: (value) => emit('update:operation', value)
})

const workstation = computed({
  get: () => props.workstation,
  set: (value) => emit('update:workstation', value)
})

const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const list = computed({
  get: () => props.list,
  set: (value) => emit('update:list', value)
})
</script>

<template>
  <div class="productionExecutionFilters">
    <OperationSelect
      v-model="operation"
      :keys="['id', 'name', 'isBatch', 'hasEquipment']"
      @input="workstation = null"
    />
    <CfSelect
      v-model="list"
      label="Display"
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
      v-model="show"
      label="Show jobs awaiting input"
    />
  </div>
</template>

<style lang="scss">
.productionExecutionFilters {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

@media (min-width: 880px) {
  .productionExecutionFilters {
    > :not(:last-child) {
      max-width: 12rem;
    }
  }
}
</style>