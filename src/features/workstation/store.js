import { ref, readonly } from 'vue'
import { useOperationStore } from '../operation/store.js'

const workstations = ref([])

const sortWorkstations = () => {
  const { operations } = useOperationStore()

  const operationPostions = {}

  operations.value.forEach(({ id, position }) => operationPostions[id] = position)

  workstations.value
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => operationPostions[a.operation.id] - operationPostions[b.operation.id])
}

export const useWorkstationStore = () => {
  const set = (data) => {
    workstations.value = data
  }

  const add = (workstation) => {
    workstations.value.push(workstation)

    sortWorkstations()
  }

  const remove = ({ id }) => {
    const index = workstations.value.findIndex(workstation => id === workstation.id)
    workstations.value.splice(index, 1)
  }

  const update = (workstation) => {
    const index = workstations.value.findIndex(({ id }) => workstation.id === id)
    Object.assign(workstations.value[index], workstation)
    
    sortWorkstations()
  }

  return {
    workstations: readonly(workstations),
    set,
    add,
    remove,
    update
  }
}