import axios from '../../../lib/axios.js'

const addWorkstation = async (workstationData) => {
  try {
    const { data } = await axios.post('/v1/workstations', workstationData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addWorkstation