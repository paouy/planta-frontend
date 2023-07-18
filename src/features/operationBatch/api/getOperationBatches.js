import axios from '../../../lib/axios.js'

const getOperationBatches = async () => {
  try {
    const { data } = await axios.get('/v1/operation-batches')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getOperationBatches