import axios from '../../../lib/axios.js'

const updateProductionOrder = async (productionOrderData) => {
  try {
    const { data } = await axios.put('/v1/production-orders', productionOrderData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateProductionOrder