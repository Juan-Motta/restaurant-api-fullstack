import axios from 'axios'

export const login = async (email: string, password: string): Promise<{ accessToken: string }> => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
    email,
    password,
  })
  return response.data
}
