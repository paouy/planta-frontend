import axios from '../../../lib/axios.js'

const cancelSalesOrder = async ({ id, ...data }) => {
  try {
    await axios.post(`/v1/sales-orders/${id}/cancel`, data)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default cancelSalesOrder