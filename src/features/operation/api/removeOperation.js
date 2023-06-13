import axios from '../../../lib/axios.js'

const removeOperation = async (id) => {
  try {
    await axios.delete('/v1/operations/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeOperation