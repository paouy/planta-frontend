import axios from '../../../lib/axios.js'

const addProductionRecord = async (productionRecordData) => {
  try {
    const { data } = await axios.post('/v1/production-records', productionRecordData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addProductionRecord