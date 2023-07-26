import axios from '../../../lib/axios.js'

const releaseProductionOrder = async (id) => {
  try {
    await axios.post(`/v1/production-orders/${id}/release`)
    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default releaseProductionOrder