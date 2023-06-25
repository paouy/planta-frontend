import axios from '../../../lib/axios.js'

/**
 * Removes a collection.
 * @param {id} id - The unique identifier of the collection.
 * @returns {Promise<void>}
 */
const removeCollection = async (id) => {
  try {
    await axios.delete('/v1/collections/' + id)
  } catch (error) {
    throw Error(error.response.data.message)
  }
}

export default removeCollection