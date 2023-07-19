import axios from '../../../lib/axios.js'

const getOperationBatch = async (id) => {
  try {
    const { data } = await axios.get('/v1/operation-batches/' + id)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getOperationBatch