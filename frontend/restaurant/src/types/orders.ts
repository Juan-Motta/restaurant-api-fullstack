import { type Recipe } from './recipes'

export interface Order {
  id: number
  name?: string
  date: string
  recipe: Recipe
  status: OrderStatus
}

export enum OrderStatus {
  PREPARING = 'PREPARING',
  IN_KITCHEN = 'IN_KITCHEN',
  FINISHED = 'FINISHED',
}
