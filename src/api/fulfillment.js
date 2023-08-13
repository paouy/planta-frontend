import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: fulfillment } = await axios.post('/v1/fulfillments', data)
    return fulfillment
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/fulfillments/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}