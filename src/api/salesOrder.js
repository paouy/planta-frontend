import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: salesOrder } = await axios.post('/v1/sales-orders', data)
    return salesOrder
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getOne = async (id) => {
  try {
    const { data: salesOrder } = await axios.get(`/v1/sales-orders/${id}`)
    return salesOrder
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async (params) => {
  try {
    const { data: salesOrders } = await axios.get('/v1/sales-orders', { params })
    return salesOrders
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/sales-orders/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const confirm = async (id) => {
  try {
    await axios.post(`/v1/sales-orders/${id}/confirm`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const forceFulfilledStatus = async (id) => {
  try {
    await axios.post(`/v1/sales-orders/${id}/fulfill`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const archive = async (id) => {
  try {
    await axios.post(`/v1/sales-orders/${id}/archive`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const cancel = async ({ id, ...data }) => {
  try {
    await axios.post(`/v1/sales-orders/${id}/cancel`, data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}