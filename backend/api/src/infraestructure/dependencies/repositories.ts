import { PoolClient } from 'pg'

import { IUserRepository } from '../../domain/repositories/users'
import { UserRepository } from '../adapters/output/repository/users'
import { IOrderRepository } from '../../domain/repositories/orders'
import { OrderRepository } from '../adapters/output/repository/orders'
import { IRecipeRepository } from '../../domain/repositories/recipes'
import { RecipeRepository } from '../adapters/output/repository/recipes'
import { IBuysRepository } from '../../domain/repositories/buys'
import { BuysRepository } from '../adapters/output/repository/buys'
import { IStorageRepository } from '../../domain/repositories/storages'
import { StorageRepository } from '../adapters/output/repository/storages'
import { IEventsLogsRepository } from '../../domain/repositories/eventsLogs'
import { EventsLogsRepository } from '../adapters/output/repository/eventsLogs'

export async function getUserRepository(
    client: PoolClient
): Promise<IUserRepository> {
    return new UserRepository(client)
}

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

export async function getBuysRepository(
    client: PoolClient
): Promise<IBuysRepository> {
    return new BuysRepository(client)
}

export async function getStorageRespository(
    client: PoolClient
): Promise<IStorageRepository> {
    return new StorageRepository(client)
}

export async function getEventsLogsRepository(
    client: PoolClient
): Promise<IEventsLogsRepository> {
    return new EventsLogsRepository(client)
}
