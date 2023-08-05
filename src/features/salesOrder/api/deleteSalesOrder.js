import axios from '../../../lib/axios.js'

const deleteSalesOrder = async (id) => {
  try {
    await axios.delete('/v1/sales-orders/' + id)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default deleteSalesOrder