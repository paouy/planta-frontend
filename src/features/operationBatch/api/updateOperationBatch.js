import axios from '../../../lib/axios.js'

const updateOperationBatch = async (operationBatchData) => {
  try {
    await axios.put('/v1/operation-batches', operationBatchData)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateOperationBatch