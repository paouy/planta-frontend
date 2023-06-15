import axios from '../../../lib/axios.js'

const removeCollection = async (id) => {
  try {
    await axios.delete('/v1/collections/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeCollection