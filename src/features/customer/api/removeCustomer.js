import axios from '../../../lib/axios.js'

const removeCustomer = async (id) => {
  try {
    await axios.delete('/v1/customers/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeCustomer