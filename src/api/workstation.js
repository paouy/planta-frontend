import axios from '../axios.js'

export const createOne = async (data) => {
  try {
    const { data: workstation } = await axios.post('/v1/workstations', data)
    return workstation
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const getAll = async () => {
  try {
    const { data: workstations } = await axios.get('/v1/workstations')
    return workstations
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const updateOne = async (data) => {
  try {
    await axios.put('/v1/workstations', data)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export const deleteOne = async (id) => {
  try {
    await axios.delete(`/v1/workstations/${id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}