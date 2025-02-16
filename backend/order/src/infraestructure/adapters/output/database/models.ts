export const UsersModel = {
    name: 'users',
    query: `
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
}

export const RecipeModel = {
    name: 'recipe',
    query: `
    CREATE TABLE recipe (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL
    );
    `
}

export const OrdersModel = {
    name: 'orders',
    query: `
    CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        recipe_id INT,
        status VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recipe_id) REFERENCES recipe(id)
    );
    `
}

export const IngredientsModel = {
    name: 'ingredients',
    query: `
    CREATE TABLE ingredients (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL
    );
    `
}

export const RecipeIngredientsModel = {
    name: 'recipe_ingredients',
    query: `
    CREATE TABLE recipe_ingredients (
        id SERIAL PRIMARY KEY,
        recipe_id INT,
        ingredient_id INT,
        FOREIGN KEY (recipe_id) REFERENCES recipe(id),
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    );
    `
}

export const BuysModel = {
    name: 'buys',
    query: `
    CREATE TABLE buys (
        id SERIAL PRIMARY KEY,
        ingredient_id INT,
        quantity INT NOT NULL,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    );
    `
}

export const StorageModel = {
    name: 'storage',
    query: `
    CREATE TABLE storage (
        id SERIAL PRIMARY KEY,
        ingredient_id INT,
        quantity INT NOT NULL,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
    );
    `
}