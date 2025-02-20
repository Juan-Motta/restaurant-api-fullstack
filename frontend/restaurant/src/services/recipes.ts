import axios from 'axios'
import { type Recipe } from '@/types/recipes'

export const getAllRecipes = async (
  page: number,
  perPage: number,
  recipeId?: string,
  recipeName?: string,
): Promise<{ data: Recipe[]; page: number; perPage: number; total: number }> => {
  const token = localStorage.getItem('jwt')
  let url = `${import.meta.env.VITE_API_URL}/recipes?page=${page}&perPage=${perPage}`
  if (recipeId) {
    url += `&recipeId=${recipeId}`
  }
  if (recipeName) {
    url += `&recipeName=${recipeName}`
  }
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data
}
