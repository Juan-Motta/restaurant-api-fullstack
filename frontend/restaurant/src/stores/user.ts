import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref<{ id: number; name: string }>({ id: 0, name: '' })

  const setUserData = (data: { id: number; name: string }) => {
    user.value = data
  }

  const getUserData = () => {
    return user.value
  }

  const clearUserData = () => {
    user.value = { id: 0, name: '' }
  }

  return { user, setUserData, getUserData, clearUserData }
})
