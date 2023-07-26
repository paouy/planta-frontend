import { ref, readonly } from 'vue'

const customers = ref([])

export const useCustomerStore = () => {
  const sortCustomers = () => {
    customers.value.sort((a, b) => a.name.toLocaleCompare(b.name))
  }
  
  const set = (data) => {
    customers.value = data
  }

  const create = (customer) => {
    customers.value.push(customer)

    sortCustomers()
  }

  const remove = (id) => {
    const index = customers.value.findIndex(customer => id === customer.id)
    customers.value.splice(index, 1)
  }

  const update = (customer) => {
    const index = customers.value.findIndex(({ id }) => customer.id === id)
    Object.assign(customers.value[index], customer)
    
    sortCustomers()
  }

  return {
    customers: readonly(customers),
    set,
    create,
    remove,
    update
  }
}