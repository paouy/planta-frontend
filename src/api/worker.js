import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: worker } = await axios.post('/v1/workers', data)
    return worker
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: workers } = await axios.get('/v1/workers')
    return workers
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/workers', data)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/workers/${id}`)
  } catch (error) {
    throw Error(error.data.message)
  }
}