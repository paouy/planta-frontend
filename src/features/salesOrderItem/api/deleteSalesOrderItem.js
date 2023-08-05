import axios from '../../../lib/axios.js'

const deleteSalesOrderItem = async (id) => {
  try {
    await axios.delete('/v1/sales-order-items/' + id)

    return 
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default deleteSalesOrderItem