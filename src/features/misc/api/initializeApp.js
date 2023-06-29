import axios from '../../../lib/axios.js'

const initializeApp = async () => {
  try {
    const { data } = await axios.get('/v1/initializeApp')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default initializeApp