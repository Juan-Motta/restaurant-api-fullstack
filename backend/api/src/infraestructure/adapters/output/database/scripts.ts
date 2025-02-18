export const UsersModel = {
    name: 'users',
    query: `
    CREATE TABLE users
    (
        id serial primary key,
        name varchar not null,
        email varchar not null unique,
        password varchar not null,
        created_at timestamp default CURRENT_TIMESTAMP
    );
    `
}

export const StorageModel = {
    name: 'storage',
    query: `
    CREATE TABLE storage
    (
        id serial primary key,
        ingredient_id integer
        references ingredients,
        quantity integer not null
    );
    `
}

export const RecipesModel = {
    name: 'recipes',
    query: `
    CREATE TABLE recipes
    (
        id serial primary key,
        name varchar not null
    );
    `
}

export const RecipeIngredientsModel = {
    name: 'recipe_ingredients',
    query: `
    CREATE TABLE recipe_ingredients
    (
        id serial primary key,
        recipe_id integer
        references recipes,
        ingredient_id integer
        references ingredients,
        quantity integer default 1 not null
    );
    `
}

export const OrdersModel = {
    name: 'orders',
    query: `
    CREATE TABLE orders
    (
        id serial primary key,
        recipe_id integer references recipes,
        status varchar not null,
        created_at timestamp default CURRENT_TIMESTAMP
    );
    `
}

export const IngredientsModel = {
    name: 'ingredients',
    query: `
    CREATE TABLE ingredients
    (
        id serial primary key,
        name varchar not null
    );
    `
}

export const EventLogsModel = {
    name: 'event_logs',
    query: `
    CREATE TABLE event_logs
    (
        id serial primary key,
        event varchar not null,
        message json not null,
        state varchar,
        created_at timestamp default CURRENT_TIMESTAMP,
        error varchar
    );
    `
}

export const BuysModel = {
    name: 'buys',
    query: `
    CREATE TABLE buys
    (
        id serial primary key,
        ingredient_id integer
        references ingredients,
        quantity integer not null,
        created_at timestamp default CURRENT_TIMESTAMP
    );
    `
}