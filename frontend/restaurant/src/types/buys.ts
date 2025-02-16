import { type Ingredient } from './ingredients'

export interface Buy {
  id: number
  date: string
  items: Ingredient[]
}
