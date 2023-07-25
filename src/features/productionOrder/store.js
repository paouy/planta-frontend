import { ref, readonly } from 'vue'

const productionOrders = ref([])

export const useProductionOrderStore = () => {
  const initialize = (data) => {
    productionOrders.value = data
  }

  const add = (productionOrder) => {
    productionOrders.value.push({
      ...productionOrder,
      seq: productionOrders.value.length + 1
    })
  }

  const remove = ({ id }) => {
    productionOrders.value = productionOrders.value
      .filter(productionOrder => id !== productionOrder.id)
      .map((productionOrder, index) => ({ ...productionOrder, seq: index + 1 }))
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
    initialize,
    add,
    remove,
    reprioritize
  }
}