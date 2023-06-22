import axios from '../../../lib/axios.js'

const getProductionJobs = async () => {
  try {
    const { data } = await axios.get('/v1/production-jobs/not-closed')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProductionJobs