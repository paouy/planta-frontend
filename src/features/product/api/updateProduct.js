import axios from '../../../lib/axios.js'

const updateProduct = async (productData) => {
  try {
    const { data } = await axios.put('/v1/products', productData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateProduct