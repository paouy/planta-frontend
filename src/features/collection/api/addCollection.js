import axios from '../../../lib/axios.js'

/**
 * Represents a collection.
 * @typedef {Object} Collection
 * @property {string} id - The unique identifier of the collection.
 * @property {string} name - The name of the collection.
 * @property {'MATERIALS'|'PRODUCTS'} type - The type of the collection.
 */

/**
 * Adds a collection.
 * @param {Object} collection
 * @param {string} collection.name - The name of the collection.
 * @param {'MATERIALS'|'PRODUCTS'} collection.type - The type of the collection.
 * @returns {Promise<Collection>}
 */
const addCollection = async ({ name, type }) => {
  try {
    const { data } = await axios.post('/v1/collections', { name, type })

    return data
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default addCollection