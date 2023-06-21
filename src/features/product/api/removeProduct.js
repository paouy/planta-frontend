import axios from '../../../lib/axios.js'

const removeProduct = async (id) => {
  try {
    await axios.delete('/v1/products/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeProduct