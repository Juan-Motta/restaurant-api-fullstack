import { Ingredient } from "./ingredients";

export interface RecipeIngredient {
    id: number;
    ingredient: Ingredient;
    quantity: number;
}

export interface Recipe {
    id: number;
    name: string;
    ingredients: RecipeIngredient[];
}