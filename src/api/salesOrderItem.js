import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: salesOrderItem } = await axios.post('/v1/sales-order-items', data)
    return salesOrderItem
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getOne = async (id) => {
  try {
    const { data: salesOrderItem } = await axios.get(`/v1/sales-order-items/${id}`)
    return salesOrderItem
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAllBySalesOrder = async (salesOrderId) => {
  try {
    const params = { salesOrderId }
    const { data: salesOrderItems } = await axios.get('/v1/sales-order-items', { params })
    return salesOrderItems
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/sales-order-items', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/sales-order-items/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}