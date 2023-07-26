import axios from '../../../lib/axios.js'

const addCustomer = async (customerData) => {
  try {
    const { data } = await axios.post('/v1/customers', customerData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addCustomer