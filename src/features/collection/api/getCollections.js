import axios from '../../../lib/axios.js'

const getCollections = async () => {
  try {
    const { data } = await axios.get('/v1/collections')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getCollections