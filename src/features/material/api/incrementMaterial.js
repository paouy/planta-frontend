import axios from '../../../lib/axios.js'

const incrementMaterial = async ({id, value}) => {
  try {
    await axios.post(`/v1/materials/${id}`, value)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default incrementMaterial