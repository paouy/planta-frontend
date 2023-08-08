import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: material } = await axios.post('/v1/materials', data)
    return material
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: materials } = await axios.get('/v1/materials')
    return materials
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/materials', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/materials/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const increment = async ({ id, qty }) => {
  try {
    await axios.post(`/v1/materials/${id}/increment`, { qty })
  } catch (error) {
    throw Error(error.response.data.message)
  }
}