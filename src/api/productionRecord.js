import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: productionRecord } = await axios.post('/v1/production-records', data)
    return productionRecord
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAllByProductionOrder = async (productionOrderId) => {
  try {
    const params = { productionOrderId }
    const { data: productionRecords } = await axios.get('/v1/production-records', { params })
    return productionRecords
  } catch (error) {
    throw Error(error.response.data.message)
  }
}