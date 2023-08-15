import { ref, readonly } from 'vue'

const workers = ref([])

const sortWorkers = () => {
  workers.value
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
    .sort((a, b) => a.lastName.localeCompare(b.lastName))
}

export const useWorkerStore = () => {
  const set = (data) => {
    workers.value = data
  }

  const add = (worker) => {
    workers.value.push(worker)

    sortWorkers()
  }

  const remove = (id) => {
    const index = workers.value.findIndex(worker => id === worker.id)
    workers.value.splice(index, 1)
  }

  const update = (worker) => {
    const index = workers.value.findIndex(({ id }) => worker.id === id)
    Object.assign(workers.value[index], worker)
    
    sortWorkers()
  }

  return {
    workers: readonly(workers),
    set,
    add,
    remove,
    update
  }
}