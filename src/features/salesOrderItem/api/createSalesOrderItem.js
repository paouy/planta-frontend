import axios from '../../../lib/axios.js'

const createSalesOrderItem = async (data) => {
  try {
    const { data: salesOrderItem } = await axios.post('/v1/sales-order-items', data)

    return salesOrderItem
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default createSalesOrderItem