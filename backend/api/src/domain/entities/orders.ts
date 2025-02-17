import { Body } from './commons'
import { Recipe } from './recipes'

export interface Order {
    id?: number
    recipe: Recipe
    status: OrderStatus
    createdAt: Date
}

export enum OrderStatus {
    PREPARING = 'PREPARING',
    IN_KITCHEN = 'IN_KITCHEN',
    FINISHED = 'FINISHED'
}

export interface CreateUserInput extends Body {
    quantity?: number
}
