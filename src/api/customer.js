import axios from '../lib/axios.js'

export const createOne = async (data) => {
  try {
    const { data: customer } = await axios.post('/v1/customers', data)
    return customer
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: customers } = await axios.get('/v1/customers')
    return customers
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/customers', data)
  } catch (error) {
    throw Error(error.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/customers/${id}`)
  } catch (error) {
    throw Error(error.data.message)
  }
}