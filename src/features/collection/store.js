import { ref, readonly } from 'vue'

const collections = ref([])

const sortCollections = () => {
  collections.value
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => a.type.localeCompare(b.type))
}

export const useCollectionStore = () => {
  const set = (data) => {
    collections.value = data
  }

  const add = (collection) => {
    collections.value.push(collection)

    sortCollections()
  }

  const remove = ({ id }) => {
    const index = collections.value.findIndex(collection => id === collection.id)
    collections.value.splice(index, 1)
  }

  const update = (collection) => {
    const index = collections.value.findIndex(({ id }) => collection.id === id)
    Object.assign(collections.value[index], collection)
    
    sortCollections()
  }

  return {
    collections: readonly(collections),
    set,
    add,
    remove,
    update
  }
}