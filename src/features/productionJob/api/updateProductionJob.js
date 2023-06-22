import axios from '../../../lib/axios.js'

const updateProductionJob = async (productionJobData) => {
  try {
    const { data } = await axios.put('/v1/production-jobs', productionJobData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateProductionJob