import dotenv from 'dotenv'

dotenv.config({ path: `${process.cwd()}/.env` })

export const settings = {
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    DB_NAME: process.env.DB_NAME || 'postgres',
    JWT_SECRET: process.env.JWT_SECRET || 'secret',
    JWT_EXPIRATION: process.env.JWT_EXPIRATION || '3600',
    API_PORT: process.env.API_PORT ? parseInt(process.env.API_PORT) : 3001,
    BROKER_HOST: process.env.BROKER_HOST || 'localhost',
    BROKER_PORT: process.env.BROKER_PORT ? parseInt(process.env.BROKER_PORT) : 5672,
}
