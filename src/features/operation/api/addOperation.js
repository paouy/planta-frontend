import axios from '../../../lib/axios.js'

const addOperation = async (operationData) => {
  try {
    const { data } = await axios.post('/v1/operations', operationData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addOperation