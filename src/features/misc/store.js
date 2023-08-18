import { ref, readonly } from 'vue'
import { useTitle } from '@vueuse/core'

const title = useTitle()
const organizationName = ref(null)
const isInitialized = ref(false)
const isInitializing = ref(false)

export const useStore = () => {
  const setOrganizatioName = (data) => {
    organizationName.value = data
    title.value = `${data} — Planta OS`
  }

  const startInitialization = () => {
    isInitializing.value = true
  }

  const completeInitialization = () => {
    isInitializing.value = false
    isInitialized.value = true
  }

  const reset = () => {
    title.value = 'Planta OS'
    organizationName.value = null
    isInitialized.value = false
    isInitializing.value = false
  }

  return {
    organizationName: readonly(organizationName),
    isInitialized: readonly(isInitialized),
    isInitializing: readonly(isInitializing),
    setOrganizatioName,
    startInitialization,
    completeInitialization,
    reset
  }
}