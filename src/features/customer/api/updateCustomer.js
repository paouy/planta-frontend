import axios from '../../../lib/axios.js'

const updateCustomer = async (customer) => {
  try {
    const { data } = await axios.put('/v1/customers', customer)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateCustomer