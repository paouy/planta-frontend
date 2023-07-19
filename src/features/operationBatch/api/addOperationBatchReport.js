import axios from '../../../lib/axios.js'

const addOperationBatchReport = async ({ id, productionRecords }) => {
  try {
    const { data } = await axios.post(`/v1/operation-batches/${id}/report`, { productionRecords })

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addOperationBatchReport