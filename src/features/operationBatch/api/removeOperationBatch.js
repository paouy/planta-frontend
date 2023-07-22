import axios from '../../../lib/axios.js'

const removeOperationBatch = async (id) => {
  try {
    await axios.delete('/v1/operation-batches/' + id)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeOperationBatch