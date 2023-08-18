import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: equipment } = await axios.post('/v1/equipments', data)
    return equipment
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: equipments } = await axios.get('/v1/equipments')
    return equipments
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/equipments', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/equipments/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}