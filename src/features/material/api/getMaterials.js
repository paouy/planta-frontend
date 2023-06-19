import axios from '../../../lib/axios.js'

const getMaterials = async () => {
  try {
    const { data } = await axios.get('/v1/materials')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getMaterials