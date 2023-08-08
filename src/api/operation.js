import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: operation } = await axios.post('/v1/operations', data)
    return operation
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: operations } = await axios.get('/v1/operations')
    return operations
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/operations', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/operations/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}