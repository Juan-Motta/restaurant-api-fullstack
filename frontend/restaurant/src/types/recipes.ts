export interface Recipe {
  id: number
  name: string
  imageUrl: string
  ingredients: {
    id: number
    name: string
    quantity: number
    imageUrl: string
  }[]
}
