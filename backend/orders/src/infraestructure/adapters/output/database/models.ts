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