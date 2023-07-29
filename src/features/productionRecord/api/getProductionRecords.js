import axios from '../../../lib/axios.js'

const getProductionRecords = async (productionOrderId) => {
  try {
    const { data } = await axios.get('/v1/production-records?productionOrderId=' + productionOrderId)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProductionRecords