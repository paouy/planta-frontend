import axios from '../../../lib/axios.js'

const removeProductMaterial = async (id) => {
  try {
    await axios.delete('/v1/product-materials/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeProductMaterial