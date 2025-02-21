import axios from 'axios'
import { type User } from '@/types/users'

export const login = async (email: string, password: string): Promise<{ accessToken: string }> => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
    email,
    password,
  })
  return response.data
}

export const registerUser = async (name: string, email: string, password: string, confirmPassword: string): Promise<User> => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/signin`, {
    name,
    email,
    password,
    confirmPassword
  })
  return response.data
}
