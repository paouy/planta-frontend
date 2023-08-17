import axios from '../axios.js'

export const login = async (data) => {
  try {
    const { data: session } = await axios.post('/v1/auth/login', data)
    return session
  } catch (error) {
    throw Error(error.data.message)
  }
}