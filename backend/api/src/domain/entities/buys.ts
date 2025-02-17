import { Ingredient } from './ingredients'

export interface Buy {
    id: number
    ingredient: {
        id: number
        name: string
    }
    quantity: number
}
