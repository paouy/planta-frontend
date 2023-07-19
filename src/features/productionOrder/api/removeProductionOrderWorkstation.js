import axios from '../../../lib/axios.js'

const removeProductionOrderWorkstation = async ({ productionOrderId, workstation }) => {
  try {
    await axios.delete(`/v1/production-orders/${productionOrderId}/workstations/${workstation.id}`)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeProductionOrderWorkstation