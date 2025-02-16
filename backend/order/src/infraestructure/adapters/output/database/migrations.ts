import { Client } from 'pg';
import { db } from '../../output/database';
import {UsersModel, OrdersModel, IngredientsModel, RecipeModel, RecipeIngredientsModel, BuysModel, StorageModel} from "./models"

export class DatabaseMigrationManager {
    private client: Client;

    constructor(client?: Client) {
        this.client = client || db;
    }

    async connect() {
        await this.client.connect();
    }

    async createTable(model: {name: string, query: string}): Promise<void> {
        const checkTableQuery = `
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = '${model.name}'
            );
        `;

        const result = await this.client.query(checkTableQuery);
        const tableExists = result.rows[0].exists;

        if (!tableExists) {
            console.log(`Table ${model.name} does not exist. Creating it...`);
            await this.client.query(model.query);
            console.log(`Table ${model.name} created successfully.`);
        } else {
            console.log(`Table ${model.name} already exists. No action taken.`);
        }
    }

    async disconnect() {
        await this.client.end();
    }

    async run() {
        await this.connect();

        await this.createTable(UsersModel);
        await this.createTable(RecipeModel);
        await this.createTable(OrdersModel);
        await this.createTable(IngredientsModel);
        await this.createTable(RecipeIngredientsModel);
        await this.createTable(BuysModel);
        await this.createTable(StorageModel);
        
        await this.disconnect();
    }
}