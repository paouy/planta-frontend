import axios from '../../../lib/axios.js'

const addOperationBatchJob = async (jobData) => {
  try {
    const { data } = await axios.post('/v1/operation-batch-jobs', jobData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addOperationBatchJob