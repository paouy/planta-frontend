import axios from '../../../lib/axios.js'

const removeWorkstation = async (id) => {
  try {
    await axios.delete('/v1/workstations/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeWorkstation