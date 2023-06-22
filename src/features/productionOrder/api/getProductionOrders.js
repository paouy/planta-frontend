import axios from '../../../lib/axios.js'

const getProductionOrders = async () => {
  try {
    const { data } = await axios.get('/v1/production-orders')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProductionOrders