import axios from '../../../lib/axios.js'

const createAllocationOrder = async (data) => {
  try {
    const { data: allocationOrder } = await axios.post('/v1/allocation-orders', data)

    return allocationOrder
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default createAllocationOrder