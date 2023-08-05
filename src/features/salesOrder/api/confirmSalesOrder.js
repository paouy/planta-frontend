import axios from '../../../lib/axios.js'

const confirmSalesOrder = async (id) => {
  try {
    await axios.post(`/v1/sales-orders/${id}/confirm`)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default confirmSalesOrder