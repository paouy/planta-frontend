<script setup>
import { computed } from 'vue'
import { CfSwitch } from '../../../components/index.js'
import OperationSelect from '../../operation/components/OperationSelect.vue'
import WorkstationSelect from '../../workstation/components/WorkstationSelect.vue'

const emit = defineEmits([
  'update:operation',
  'update:workstation',
  'update:showJobsAwaitingInput'
])

const props = defineProps({
  operation: Object,
  workstation: Object,
  showJobsAwaitingInput: Boolean
})

const operation = computed({
  get() {
    return props.operation
  },
  set(value) {
    emit('update:operation', value)
  }
})

const workstation = computed({
  get() {
    return props.workstation
  },
  set(value) {
    emit('update:workstation', value)
  }
})

const showJobsAwaitingInput = computed({
  get() {
    return props.showJobsAwaitingInput
  },
  set(value) {
    emit('update:showJobsAwaitingInput', value)
  }
})
</script>

<template>
  <div class="productionExecutionFilters">
    <OperationSelect
      v-model="operation"
      :keys="['id', 'name', 'type']"
      default-option
      @input=""
    />
    <WorkstationSelect
      v-model="workstation"
      :operation-id="operation.id"
      :disabled="!operation.id"
      :required="false"
    />
    <CfSwitch
      v-model="showJobsAwaitingInput"
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