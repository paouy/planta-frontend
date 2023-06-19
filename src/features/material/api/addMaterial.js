import axios from '../../../lib/axios.js'

const addMaterial = async (materialData) => {
  try {
    const { data } = await axios.post('/v1/materials', materialData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addMaterial