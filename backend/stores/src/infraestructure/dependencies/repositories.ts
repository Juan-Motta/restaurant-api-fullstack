import { PoolClient } from 'pg'

import { IOrderRepository } from '../../domain/repositories/orders'
import { OrderRepository } from '../adapters/output/repository/orders'
import { IRecipeRepository } from '../../domain/repositories/recipes'
import { RecipeRepository } from '../adapters/output/repository/recipes'

export async function getOrderRepository(
    client: PoolClient
): Promise<IOrderRepository> {
    return new OrderRepository(client)
}

export async function getRecipeRepository(
    client: PoolClient
): Promise<IRecipeRepository> {
    return new RecipeRepository(client)
}
