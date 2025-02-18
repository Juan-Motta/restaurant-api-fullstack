import axios from 'axios'

export const getAllRecipes = async (
  page: number,
  perPage: number,
  recipeId?: string,
  recipeName?: string,
) => {
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
