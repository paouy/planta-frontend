import axios from '../../../lib/axios.js'

const addCollection = async (collectionData) => {
  try {
    const { data } = await axios.post('/v1/collections', collectionData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addCollection