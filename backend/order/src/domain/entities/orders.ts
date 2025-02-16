import { Recipe } from './recipes';

export interface Order {
    id: number;
    recipe: Recipe;
    status: string;
    createdAt: Date;
}