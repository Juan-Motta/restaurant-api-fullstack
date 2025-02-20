import axios from 'axios'
import { type Buy } from '@/types/buys'

export const getAllBuys = async (
  page: number,
  perPage: number,
  buyId?: string | number,
  ingredientId?: string | number,
  ingredientName?: string | number,
): Promise<{ data: Buy[]; page: number; perPage: number; total: number }> => {
  const token = localStorage.getItem('jwt')
  let url = `${import.meta.env.VITE_API_URL}/buys?page=${page}&perPage=${perPage}`
  if (buyId) {
    url += `&buyId=${buyId}`
  }
  if (ingredientId) {
    url += `&ingredientId=${ingredientId}`
  }
  if (ingredientName) {
    url += `&ingredientName=${ingredientName}`
  }
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
