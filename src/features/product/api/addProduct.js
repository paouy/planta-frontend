import axios from '../../../lib/axios.js'

const addProduct = async (productData) => {
  try {
    const { data } = await axios.post('/v1/products', productData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addProduct