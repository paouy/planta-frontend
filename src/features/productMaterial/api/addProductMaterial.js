import axios from '../../../lib/axios.js'

const addProductMaterial = async (productMaterialData) => {
  try {
    const { data } = await axios.post('/v1/product-materials', productMaterialData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addProductMaterial