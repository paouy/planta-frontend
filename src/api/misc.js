import axios from '../lib/axios.js'

export const initializeApp = async () => {
  try {
    const { data } = axios.get('/v1/initializeApp')
    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}