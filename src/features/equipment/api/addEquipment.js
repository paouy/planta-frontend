import axios from '../../../lib/axios.js'

const addEquipment = async (equipmentData) => {
  try {
    const { data } = await axios.post('/v1/equipments', equipmentData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addEquipment