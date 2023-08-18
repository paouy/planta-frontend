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

  const remove = (id) => {
    const index = operations.value.findIndex(operation => id === operation.id)
    operations.value.splice(index, 1)
  }

  const update = (operation) => {
    const index = operations.value.findIndex(({ id }) => operation.id === id)
    Object.assign(operations.value[index], operation)
    
    sortOperations()
  }

  const moveUp = (index) => {
    if (index <= 0 || index >= operations.value.length) {
      return false
    }

    operations.value[index].seq--
    operations.value[index - 1].seq++

    [
      operations.value[index],
      operations.value[index - 1]
    ] = [
      operations.value[index - 1],
      operations.value[index]
    ]
  }
  
  const moveDown = (index) => {
    if (index < 0 || index >= operations.value.length - 1) {
      return false
    }

    operations.value[index].seq++
    operations.value[index + 1].seq--
  
    [
      operations.value[index],
      operations.value[index + 1]
    ] = [
      operations.value[index + 1],
      operations.value[index]
    ]
  }

  return {
    operations: readonly(operations),
    set,
    add,
    remove,
    update,
    moveUp,
    moveDown
  }
}