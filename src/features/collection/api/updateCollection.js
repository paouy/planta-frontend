import axios from '../../../lib/axios.js'

const updateCollection = async (collectionData) => {
  try {
    const { data } = await axios.put('/v1/collections', collectionData)

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateCollection