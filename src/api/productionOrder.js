import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: productionOrder } = await axios.post('/v1/production-orders', data)
    return productionOrder
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getOne = async (id) => {
  try {
    const { data: productionOrder } = await axios.get(`/v1/production-orders/${id}`)
    return productionOrder
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getAllNotReleased = async (params) => {
  try {
    const { data: productionOrders } = await axios.get('/v1/production-orders', { params })
    return productionOrders
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getAllReleased = async () => {
  try {
    const { data: productionOrders } = await axios.get('/v1/production-orders/released')
    return productionOrders
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/production-orders', data)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/production-orders/${id}`)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const cancel = async (id) => {
  try {
    await axios.post(`/v1/production-orders/${id}/cancel`)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const release = async (id) => {
  try {
    await axios.post(`/v1/production-orders/${id}/release`)
  } catch (error) {
    throw Error(error.data.message)
  }
}