import axios from '../lib/axios.js'

export const get = async (key) => {
  const params = {}

  if (typeof key === 'string') {
    params.key = key
  } else {
    params.keys = key.split(',')
  }

  try {
    const { data } = await axios.get('/v1/lookup', { params })
    return data
  } catch (error) {
    throw Error(error.data.message)
  }
}