<script setup>
import { ref, computed } from 'vue'
import { CfFilledButton, CfOutlinedButton, CfSelect, CfTag } from 'vue-cf-ui'
import { useEquipmentStore } from '../../equipment/index.js'
import { useOperationStore } from '../../operation/index.js'
import { useWorkerStore } from '../../worker/index.js'
import { useWorkstationStore } from '../../workstation/index.js'

const emit = defineEmits([
  'update:operations',
  'update:workstations',
  'update:workers',
  'update:equipments'
])
const props = defineProps({
  operations: Array,
  workstations: Array,
  workers: Array,
  equipments: Array
})
const resourceTypeOptions = [
  { label: 'Operation', value: 'operations' },
  { label: 'Workstation', value: 'workstations' },
  { label: 'Equipment', value: 'equipments' },
  { label: 'Worker', value: 'workers' }
]

const showDialog = ref(false)
const resourceType = ref(null)
const resource = ref(null)

const resourceOptions = computed(() => {
  if (!showDialog.value) return []

  const { equipments } = useEquipmentStore()
  const { operations } = useOperationStore()
  const { workers } = useWorkerStore()
  const { workstations } = useWorkstationStore()

  const resources = {
    'equipments': equipments.value,
    'operations': operations.value,
    'workers': workers.value,
    'workstations': workstations.value
  }

  const selectedResourceIds = props[resourceType.value].map(({ id }) => id)

  const options = resources[resourceType.value]
    .filter(({ id }) => !selectedResourceIds.includes(id))
    .map(({ id, name }) => ({ label: name, value: { id, name }}))

  return options
})

const open = () => {
  showDialog.value = true
  resourceType.value = 'operations'
}

const cancel = () => {
  showDialog.value = false
  resourceType.value = null
  resource.value = null
}

const invoke = () => {
  const value = [...props[resourceType.value], resource.value]

  emit(`update:${resourceType.value}`, value)

  cancel()
}

const onRemove = (type, id) => {
  const value = props[type].filter(obj => obj.id !== id)

  emit(`update:${type}`, value)
}
</script>

<template>
  <div class="reports-filters">
    <CfOutlinedButton @click="open">
      Add filter
    </CfOutlinedButton>
    <div class="reports-filters-dialog" v-if="showDialog">
      <p>New filter</p>
      <form id="addFilter" @submit.prevent="invoke">
        <CfSelect
          v-model="resourceType"
          :options="resourceTypeOptions"
          required
          @input="resource = null"
        />
        <div>equals</div>
        <CfSelect
          v-model="resource"
          :options="resourceOptions"
          required
        />
      </form>
      <footer>
        <CfFilledButton type="sumbmit" form="addFilter">
          Apply
        </CfFilledButton>
        <CfFilledButton color="gray" @click="cancel">
          Cancel
        </CfFilledButton>
      </footer>
    </div>
    <div class="reports-filters-tags">
      <CfTag v-for="o in props.operations" :key="o.id" @remove="onRemove('operations', o.id)">
        Operation equals {{ o.name }}
      </CfTag>
      <CfTag v-for="w in props.workstations" :key="w.id" @remove="onRemove('workstations', w.id)">
        Workstation equals {{ w.name }}
      </CfTag>
      <CfTag v-for="e in props.equipments" :key="e.id" @remove="onRemove('equipments', e.id)">
        Equipment equals {{ e.name }}
      </CfTag>
      <CfTag v-for="w in props.workers" :key="w.id" @remove="onRemove('workers', w.id)">
        Worker equals {{ w.name }}
      </CfTag>
    </div>
  </div>
</template>

<style lang="scss">
.reports-filters {
  position: relative;

  &-dialog {
    padding: 1rem;
    border: 1px solid var(--cf-gray-7);
    border-radius: 0.3125rem;
    background: #fff;
    width: 32rem;
    position: absolute;
    top: 2.8rem;
    z-index: 10;

    p {
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    form {
      display: flex;
      gap: 0.5rem;
      align-items: center;

      div {
        font-size: 0.875rem;
      }
    }

    footer {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }
  }

  &-tags {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
    margin-top: 0.25rem;
  }
}
</style>