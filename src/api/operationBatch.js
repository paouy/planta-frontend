import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: operationBatch } = await axios.post('/v1/operation-batches', data)
    return operationBatch
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getOne = async (id) => {
  try {
    const { data: operationBatch } = await axios.get(`/v1/operation-batches/${id}`)
    return operationBatch
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getAllNotClosed = async () => {
  try {
    const { data: operationBatches } = await axios.get('/v1/operation-batches')
    return operationBatches
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/operation-batches', data)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/operation-batches/${id}`)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const start = async (id) => {
  try {
    await axios.post(`/v1/operation-batches/${id}/start`)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const createReport = async (data) => {
  try {
    await axios.post('/v1/operation-batches/report', data)
  } catch (error) {
    throw Error(error.data.message)
  }
}