import axios from '../../../lib/axios.js'

const removeProductionOrder = async (id) => {
  try {
    await axios.delete('/v1/production-orders/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeProductionOrder