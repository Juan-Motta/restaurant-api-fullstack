import { type Ingredient } from './ingredients'

export interface Recipe {
  id: number
  name: string
  ingredients: Ingredient[]
}
