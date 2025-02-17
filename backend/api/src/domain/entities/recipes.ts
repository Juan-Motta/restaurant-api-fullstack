export interface Recipe {
    id?: number
    name: string
}

export interface RecipeWithIngredients {
    id?: number
    name: string
    ingredients: {
        id: number
        name: string
        quantity: number
    }[]
}
