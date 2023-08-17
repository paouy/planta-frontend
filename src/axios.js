import Axios from 'axios'
import { useAuth } from './features/auth/index.js'

const axios = Axios.create({
  baseURL: '/api'
})

axios.interceptors.request.use(config => {
  const { session } = useAuth()

  if (session.value.token) {
    config.headers['Authorization'] = `Bearer ${session.value.token}`
  }

  return config
})

export default axios