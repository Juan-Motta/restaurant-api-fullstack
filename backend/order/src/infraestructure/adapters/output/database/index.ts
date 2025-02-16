import pg from 'pg';

const { Client } = pg;

export const db = new Client({
    user: 'juan',
    password: '',
    host: 'localhost',
    port: 5432,
    database: 'restaurant_db'
})
