import { db } from '../../output/database'
import {
    UsersModel,
    StorageModel,
    RecipesModel,
    RecipeIngredientsModel,
    OrdersModel,
    IngredientsModel,
    EventLogsModel,
    BuysModel
} from './scripts'
import Logger from '../../../config/logger'

export async function migrate(model: {
    name: string
    query: string
}): Promise<void> {
    const client = await db.connect()

    const checkTableQuery = `
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = '${model.name}'
        );
    `

    const result = await client.query(checkTableQuery)
    const tableExists = result.rows[0].exists

    if (!tableExists) {
        Logger.info(`Table ${model.name} does not exist. Creating it...`)
        await client.query(model.query)
        Logger.info(`Table ${model.name} created successfully.`)
    } else {
        Logger.info(`Table ${model.name} already exists. No action taken.`)
    }

    client.release()
}

export async function migrateAll() {
    Logger.info('Migrating tables...')
    await migrate(UsersModel)
    await migrate(IngredientsModel)
    await migrate(RecipesModel)
    await migrate(RecipeIngredientsModel)
    await migrate(StorageModel)
    await migrate(OrdersModel)
    await migrate(BuysModel)
    await migrate(EventLogsModel)
}
