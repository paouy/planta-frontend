import axios from '../../../lib/axios.js'

const replaceProductionOrderWorkstation = async (id, workstationId, newWorkstationId) => {
  try {
    await axios.put(`/v1/production-orders/${id}/workstations/${workstationId}`, newWorkstationId)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default replaceProductionOrderWorkstation