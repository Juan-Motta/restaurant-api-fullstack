import { Pool } from 'pg'

import { settings } from '../../../config/settings'
import Logger from '../../../config/logger'

Logger.info('Connecting to database...')

export const db: Pool = new Pool({
    user: settings.DB_USER,
    password: settings.DB_PASSWORD,
    host: settings.DB_HOST,
    port: settings.DB_PORT,
    database: settings.DB_NAME
})
