import axios from '../../../lib/axios.js'

const addOperationBatchReport = async ({ id, ...data }) => {
  try {
    await axios.post(`/v1/operation-batches/${id}/report`, data)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addOperationBatchReport