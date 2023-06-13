import axios from '../../../lib/axios.js'

const getOperations = async () => {
  try {
    const { data } = await axios.get('/v1/operations')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getOperations