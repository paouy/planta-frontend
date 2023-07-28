import axios from '../../../lib/axios.js'

const getSalesOrders = async () => {
  try {
    const { data: salesOrders } = await axios.get('/v1/sales-orders')

    return salesOrders
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getSalesOrders