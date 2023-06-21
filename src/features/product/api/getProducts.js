import axios from '../../../lib/axios.js'

const getProducts = async () => {
  try {
    const { data } = await axios.get('/v1/products')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getProducts