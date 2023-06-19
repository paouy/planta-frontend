import axios from '../../../lib/axios.js'

const removeMaterial = async (id) => {
  try {
    await axios.delete('/v1/materials/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeMaterial