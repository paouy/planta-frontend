import axios from '../../../lib/axios.js'

const getProductionOrdersByOperationBatch = async (operationBatchId) => {
  try {
    const { data } = await axios.get('/v1/production-orders?operationBatchId=' + operationBatchId)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProductionOrdersByOperationBatch