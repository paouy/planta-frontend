import axios from '../../../lib/axios.js'

const updateSalesOrder = async (data) => {
  try {
    await axios.put('/v1/sales-orders', data)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateSalesOrder