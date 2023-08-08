import { ref, readonly } from 'vue'

const categories = ref([])

const sortCategories = () => {
  categories.value
    .sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => a.type.localeCompare(b.type))
}

export const useCategoryStore = () => {
  const set = (data) => {
    categories.value = data
  }

  const add = (category) => {
    categories.value.push(category)

    sortCategories()
  }

  const remove = ({ id }) => {
    const index = categories.value.findIndex(category => id === category.id)
    categories.value.splice(index, 1)
  }

  const update = (category) => {
    const index = categories.value.findIndex(({ id }) => category.id === id)
    Object.assign(categories.value[index], category)
    
    sortCategories()
  }

  return {
    categories: readonly(categories),
    set,
    add,
    remove,
    update
  }
}