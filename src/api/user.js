import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: user } = await axios.post('/v1/users', data)
    return user
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: users } = await axios.get('/v1/users')
    return users
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/users', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/users/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}