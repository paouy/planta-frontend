import axios from '../../../lib/axios.js'

const addProductionOrderWorkstation = async ({ productionOrderId, workstation }) => {
  try {
    await axios.post(`/v1/production-orders/${productionOrderId}/workstations`, workstation.id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addProductionOrderWorkstation