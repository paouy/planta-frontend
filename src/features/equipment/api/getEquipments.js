import axios from '../../../lib/axios.js'

const getEquipments = async () => {
  try {
    const { data } = await axios.get('/v1/equipments')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getEquipments