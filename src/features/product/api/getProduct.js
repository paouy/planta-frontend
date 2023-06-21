import axios from '../../../lib/axios.js'

const getProduct = async (id) => {
  try {
    const { data } = await axios.get('/v1/products/' + id)
    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProduct