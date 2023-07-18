import axios from '../../../lib/axios.js'

const addOperationBatch = async (operationData) => {
  try {
    const { data } = await axios.post('/v1/operation-batches', operationData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addOperationBatch