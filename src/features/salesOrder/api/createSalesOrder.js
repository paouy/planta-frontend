import axios from '../../../lib/axios.js'

const createSalesOrder = async (data) => {
  try {
    const { data: salesOrder } = await axios.post('/v1/sales-orders', data)

    return salesOrder
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default createSalesOrder