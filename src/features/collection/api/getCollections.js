import axios from '../../../lib/axios.js'

/**
 * Represents a collection.
 * @typedef {Object} Collection
 * @property {string} id - The unique identifier of the collection.
 * @property {string} name - The name of the collection.
 * @property {'MATERIALS'|'PRODUCTS'} type - The type of the collection.
 */

/**
 * Gets all collections.
 * @returns {Promise<Collection[]>}
 */
const getCollections = async () => {
  try {
    const { data } = await axios.get('/v1/collections')

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default getCollections