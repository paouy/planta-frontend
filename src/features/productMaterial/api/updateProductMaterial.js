import axios from '../../../lib/axios.js'

const updateProductMaterial = async (productMaterialData) => {
  try {
    const { data } = await axios.put('/v1/product-materials', productMaterialData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateProductMaterial