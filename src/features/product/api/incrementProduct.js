import axios from '../../../lib/axios.js'

const incrementProduct = async ({id, value}) => {
  try {
    await axios.post(`/v1/products/${id}`, value)

    return
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default incrementProduct