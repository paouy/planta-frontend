import { ref, readonly } from 'vue'

const productionOrders = ref([])

export const useProductionOrderStore = () => {
  const set = (data) => {
    productionOrders.value = data
  }

  const create = (data) => {
    const seq = productionOrders.value.length + 1
    productionOrders.value.push({ ...data, seq })
  }

  const reprioritize = ({ id, priority }) => {
    const productionOrder = productionOrders.value.find(order => order.id === id)

    productionOrder.priority = priority

    productionOrders.value = productionOrders.value
      .sort((a, b) => a.priority - b.priority)
      .sort((a, b) => a.id - b.id)
      .map((data, index) => ({ ...data, seq: index + 1 }))
  }

  return {
    productionOrders: readonly(productionOrders),
    set,
    create,
    reprioritize
  }
}