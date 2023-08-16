import axios from '../lib/axios.js'

export const getAll = async (params) => {
  try {
    const { data: allocations } = await axios.get('/v1/allocations', { params })
    return allocations
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const increment = async (data) => {
  try {
    await axios.post('/v1/allocations/increment', data)
  } catch (error) {
    throw Error(error.data.message)
  }
}