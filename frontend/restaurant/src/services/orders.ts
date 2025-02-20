import axios from 'axios'
import { type Order } from '@/types/orders'

export const getAllOrders = async (
  page: number,
  perPage: number,
  orderId?: number | string,
  orderStatus?: string,
): Promise<{ data: Order[]; page: number; perPage: number; total: number }> => {
  const token = localStorage.getItem('jwt')
  let url = `${import.meta.env.VITE_API_URL}/orders?page=${page}&perPage=${perPage}`
  if (orderId) {
    url += `&orderId=${orderId}`
  }
  if (orderStatus) {
    url += `&orderStatus=${orderStatus}`
  }
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}

export const createOrder = async (): Promise<Order> => {
  const token = localStorage.getItem('jwt')
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/orders`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response.data
}
