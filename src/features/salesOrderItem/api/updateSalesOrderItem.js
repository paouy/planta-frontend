import axios from '../../../lib/axios.js'

const updateSalesOrderItem = async (data) => {
  try {
    await axios.put('/v1/sales-order-items', data)

    return 
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateSalesOrderItem