import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: metafield } = await axios.post('/v1/metafields', data)
    return metafield
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: metafields } = await axios.get('/v1/metafields')
    return metafields
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/metafields', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/metafields/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}