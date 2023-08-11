import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    await axios.post('/v1/operation-batch-jobs', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (data) => {
  try {
    await axios.post('/v1/operation-batch-jobs/delete', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}