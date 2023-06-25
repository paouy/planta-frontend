import axios from '../../../lib/axios.js'

/**
 * Updates a collection.
 * @param {Object} collection
 * @param {string} collection.id - The unique identifier of the collection.
 * @param {string} collection.name - The name of the collection.
 * @param {'MATERIALS'|'PRODUCTS'} collection.type - The type of the collection.
 * @returns {Promise<void>}
 */
const updateCollection = async ({ id, name, type }) => {
  try {
    await axios.put('/v1/collections', { id, name, type })
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default updateCollection