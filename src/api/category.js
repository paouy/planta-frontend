import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: category } = await axios.post('/v1/categories', data)
    return category
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: categories } = await axios.get('/v1/categories')
    return categories
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/categories', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/categories/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}