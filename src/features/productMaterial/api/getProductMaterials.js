import axios from '../../../lib/axios.js'

const getProductMaterials = async (productId) => {
  try {
    const { data } = await axios.get('/v1/product-materials?productId=' + productId)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProductMaterials