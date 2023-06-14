import axios from '../../../lib/axios.js'

const updateWorkstation = async (workstationData) => {
  try {
    const { data } = await axios.put('/v1/workstations', workstationData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateWorkstation