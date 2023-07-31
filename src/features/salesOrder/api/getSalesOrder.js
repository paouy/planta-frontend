import axios from '../../../lib/axios.js'

const getSalesOrder = async (id) => {
  try {
    const { data: salesOrder } = await axios.get('/v1/sales-orders/' + id)

    return salesOrder
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getSalesOrder