import axios from '../../../lib/axios.js'

const getWorkstations = async () => {
  try {
    const { data } = await axios.get('/v1/workstations')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getWorkstations