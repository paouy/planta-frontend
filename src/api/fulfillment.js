import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: fulfillment } = await axios.post('/v1/fulfillments', data)
    return fulfillment
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAllBySalesOrder = async (id) => {
  try {
    const { data: fulfillments } = await axios.get('/v1/fulfillments?salesOrderId=' + id)
    return fulfillments
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