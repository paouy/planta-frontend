import axios from '../../../lib/axios.js'

const updateEquipment = async (equipmentData) => {
  try {
    const { data } = await axios.put('/v1/equipments', equipmentData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateEquipment