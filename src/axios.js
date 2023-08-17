import Axios from 'redaxios'

const axios = Axios.create({
  baseURL: '/api'
})

export default axios