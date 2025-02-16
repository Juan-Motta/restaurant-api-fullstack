import { Ingredient } from './ingredients';

export interface Buy {
    id: number;
    ingredient: Ingredient;
    quantity: number;
}