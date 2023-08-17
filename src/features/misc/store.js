import { ref, readonly } from 'vue'

const isInitialized = ref(false)
const isInitializing = ref(false)

export const useStore = () => {
  const startInitialization = () => {
    isInitializing.value = true
  }

  const completeInitialization = () => {
    isInitializing.value = false
    isInitialized.value = true
  }

  return {
    isInitialized: readonly(isInitialized),
    isInitializing: readonly(isInitializing),
    startInitialization,
    completeInitialization
  }
}