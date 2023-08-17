import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: product } = await axios.post('/v1/products', data)
    return product
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getOne = async (id) => {
  try {
    const { data: product } = await axios.get(`/v1/products/${id}`)
    return product
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: products } = await axios.get('/v1/products')
    return products
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/products', data)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/products/${id}`)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const increment = async ({ id, qty }) => {
  try {
    await axios.post(`/v1/products/${id}/increment`, { qty })
  } catch (error) {
    throw Error(error.data.message)
  }
}