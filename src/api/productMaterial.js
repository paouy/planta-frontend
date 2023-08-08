import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    await axios.post('/v1/product-materials', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async (productId) => {
  try {
    const { data: productMaterials } = await axios.get(`/v1/product-materials?productId=${productId}`)
    return productMaterials
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/product-materials', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (data) => {
  try {
    await axios.post('/v1/product-materials/delete', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}