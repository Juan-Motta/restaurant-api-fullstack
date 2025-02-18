import axios from 'axios'

export const getAllOrders = async (
  page: number,
  perPage: number,
  orderId?: number,
  orderStatus?: string,
) => {
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

export const createOrder = async () => {
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
