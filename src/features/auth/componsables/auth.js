import { readonly } from 'vue'
import { useStorage } from '@vueuse/core'

const session = useStorage('planta-session', {
  user: null,
  token: null,
  expiresIn: null
})

const storeSession = (data) => {
  session.value = data
}

const clearSession = () => {
  return new Promise((resolve) => {
    session.value = {
      user: null,
      token: null,
      expiresIn: null
    }

    resolve()
  })
}

export const useAuth = () => {
  return {
    session: readonly(session),
    storeSession,
    clearSession
  }
}