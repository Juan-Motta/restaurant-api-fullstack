import { Ingredient } from './ingredients';

export interface Storage {
    id: number;
    ingredient: Ingredient;
    quantity: number;
}