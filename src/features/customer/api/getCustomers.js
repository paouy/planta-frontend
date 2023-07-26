import axios from '../../../lib/axios.js'

const getCustomers = async () => {
  try {
    const { data } = await axios.get('/v1/customers')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getCustomers