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

  return {
    productionOrders: readonly(productionOrders),
    initialize,
    add,
    remove
  }
}