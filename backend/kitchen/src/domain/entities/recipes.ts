export interface Recipe {
    id?: number
    name: string
}

export interface RecipeIngredientNeeded {
    ingredientId: number
    ingredientName: string
    requiredQuantity: number
    availableQuantity: number
    shortageQuantity: number
}