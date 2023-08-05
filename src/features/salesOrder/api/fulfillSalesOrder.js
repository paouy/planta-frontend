import axios from '../../../lib/axios.js'

const fulfillSalesOrder = async (id) => {
  try {
    await axios.post(`/v1/sales-orders/${id}/fulfill`)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default fulfillSalesOrder