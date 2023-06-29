import { ref, readonly } from 'vue'

const equipments = ref([])

const sortEquipments = () => {
  equipments.value.sort((a, b) => a.name.localeCompare(b.name))
}

export const useEquipmentStore = () => {
  const set = (data) => {
    equipments.value = data
  }

  const add = (equipment) => {
    equipments.value.push(equipment)

    sortEquipments()
  }

  const remove = ({ id }) => {
    const index = equipments.value.findIndex(equipment => id === equipment.id)
    equipments.value.splice(index, 1)
  }

  const update = (equipment) => {
    const index = equipments.value.findIndex(({ id }) => equipment.id === id)
    Object.assign(equipments.value[index], equipment)
    
    sortEquipments()
  }

  return {
    equipments: readonly(equipments),
    set,
    add,
    remove,
    update
  }
}