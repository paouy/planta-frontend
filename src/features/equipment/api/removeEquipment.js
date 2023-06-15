import axios from '../../../lib/axios.js'

const removeEquipment = async (id) => {
  try {
    await axios.delete('/v1/equipments/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeEquipment