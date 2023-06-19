import axios from '../../../lib/axios.js'

const updateMaterial = async (materialData) => {
  try {
    const { data } = await axios.put('/v1/materials', materialData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateMaterial