import { PoolClient } from 'pg'

import { IOrderRepository } from '../../domain/repositories/orders'
import { OrderRepository } from '../adapters/output/repository/orders'
import { IEventsLogsRepository } from '../../domain/repositories/eventsLogs'
import { EventsLogsRepository } from '../adapters/output/repository/eventsLogs'
import { IStorageRepository } from '../../domain/repositories/storages'
import { StorageRepository } from '../adapters/output/repository/storages'

export async function getOrderRepository(
    client: PoolClient
): Promise<IOrderRepository> {
    return new OrderRepository(client)
}

export async function getSorageRepository(client: PoolClient): Promise<IStorageRepository> {
    return new StorageRepository(client)
}

export async function getEventsLogsRepository(
    client: PoolClient
): Promise<IEventsLogsRepository> {
    return new EventsLogsRepository(client)
}