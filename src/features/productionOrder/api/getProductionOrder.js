import axios from '../../../lib/axios.js'

const getProductionOrder = async (id) => {
  try {
    const { data } = await axios.get('/v1/production-orders/' + id)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProductionOrder