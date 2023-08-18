import axios from '../axios.js'

export const getAll = async (params) => {
  try {
    const { data: jobs } = await axios.get('/v1/jobs', { params })
    return jobs
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/jobs', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}