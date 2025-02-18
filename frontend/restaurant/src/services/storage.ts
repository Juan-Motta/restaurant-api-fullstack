import axios from 'axios'

export const getAllIngredients = async (
  page: number,
  perPage: number,
  ingredientId?: string,
  ingredientName?: string,
) => {
  const token = localStorage.getItem('jwt')
  let url = `${import.meta.env.VITE_API_URL}/ingredients?page=${page}&perPage=${perPage}`
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
