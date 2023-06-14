import axios from '../../../lib/axios.js'

const updateOperation = async (operationData) => {
  try {
    const { data } = await axios.put('/v1/operations', operationData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateOperation