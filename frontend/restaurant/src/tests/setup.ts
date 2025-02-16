import { beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Initializes Pinia for testing before each test
beforeEach(() => {
  const pinia = createPinia()
  setActivePinia(pinia)
})
