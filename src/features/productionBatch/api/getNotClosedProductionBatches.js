import axios from '../../../lib/axios.js'

const getNotClosedProductionBatches = async () => {
  try {
    const { data } = await axios.get('/v1/production-batches/not-closed')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getNotClosedProductionBatches