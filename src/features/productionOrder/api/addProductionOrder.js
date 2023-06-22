import axios from '../../../lib/axios.js'

const addProductionOrder = async (productionOrderData) => {
  try {
    const { data } = await axios.post('/v1/production-orders', productionOrderData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addProductionOrder