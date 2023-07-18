import { ref, readonly } from 'vue'

const operations = ref([])

const sortOperations = () => {
  operations.value.sort((a, b) => a.seq - b.seq)
}

export const useOperationStore = () => {
  const set = (data) => {
    operations.value = data
  }

  const add = (operation) => {
    operations.value.push(operation)

    sortOperations()
  }

  const remove = ({ id }) => {
    const index = operations.value.findIndex(operation => id === operation.id)
    operations.value.splice(index, 1)
  }

  const update = (operation) => {
    const index = operations.value.findIndex(({ id }) => operation.id === id)
    Object.assign(operations.value[index], operation)
    
    sortOperations()
  }

  return {
    operations: readonly(operations),
    set,
    add,
    remove,
    update
  }
}