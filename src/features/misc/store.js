import { ref, readonly } from 'vue'

const organizationName = ref(null)
const isInitialized = ref(false)
const isInitializing = ref(false)

export const useStore = () => {
  const setOrganizatioName = (data) => {
    organizationName.value = data
  }

  const startInitialization = () => {
    isInitializing.value = true
  }

  const completeInitialization = () => {
    isInitializing.value = false
    isInitialized.value = true
  }

  return {
    organizationName: readonly(organizationName),
    isInitialized: readonly(isInitialized),
    isInitializing: readonly(isInitializing),
    setOrganizatioName,
    startInitialization,
    completeInitialization
  }
}