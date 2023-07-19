import axios from '../../../lib/axios.js'

const startOperationBatch = async (id) => {
  try {
    await axios.post(`/v1/operation-batches/${id}/start`)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default startOperationBatch