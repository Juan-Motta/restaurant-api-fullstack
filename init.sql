CREATE TABLE IF NOT EXISTS users
(
	id serial primary key,
	name varchar not null,
	email varchar not null unique,
	password varchar not null,
	created_at timestamp default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ingredients
(
	id serial primary key,
	name varchar not null,
	image_url varchar
);

CREATE TABLE IF NOT EXISTS recipes
(
	id serial primary key,
	name varchar not null,
	image_url varchar
);

CREATE TABLE IF NOT EXISTS storage
(
	id serial primary key,
	ingredient_id integer
	references ingredients,
	quantity integer not null,
	created_at timestamp default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipe_ingredients
(
	id serial primary key,
	recipe_id integer
	references recipes,
	ingredient_id integer
	references ingredients,
	quantity integer default 1 not null
);

CREATE TABLE IF NOT EXISTS orders
(
	id serial primary key,
	recipe_id integer references recipes,
	status varchar not null,
	created_at timestamp default CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_logs
(
	id serial primary key,
	event varchar not null,
	message json not null,
	state varchar,
	created_at timestamp default CURRENT_TIMESTAMP,
	error varchar
);

CREATE TABLE IF NOT EXISTS buys
(
	id serial primary key,
	ingredient_id integer
	references ingredients,
	quantity integer not null,
	created_at timestamp default CURRENT_TIMESTAMP
);

INSERT INTO recipes (id, name, image_url) VALUES
    (1, 'Cheesy Chicken and Rice Casserole', '/cheesy_chicken_and_rice_casserole_min.webp'),
    (2, 'Tomato and Onion Stuffed Potatoes', '/tomato_and_onion_stuffed_potatoes_min.webp'),
    (3, 'Lemon Herb Grilled Chicken Salad', '/lemon_herb_grilled_chicken_salad_min.webp'),
    (4, 'Ketchup Glazed Meatballs with Rice', '/ketchup_glazed_meatballs_with_rice_min.webp'),
    (5, 'Chicken and Rice Skillet with Lemon and Tomato', '/chicken_and_rice_skillet_with_lemon_and_tomato_min.webp'),
    (6, 'Lettuce Wraps with Spiced Meat and Ketchup', '/lettuce_wraps_with_spiced_meat_and_ketchup_min.webp')
ON CONFLICT DO NOTHING;

ALTER SEQUENCE recipes_id_seq RESTART WITH 7;

INSERT INTO ingredients (id, name, image_url) VALUES
    (1, 'tomato', '/tomato_min.webp'),
    (2, 'lemon', '/lemon_min.webp'),
    (3, 'potato', '/potato_min.webp'),
    (4, 'rice', '/rice_min.webp'),
    (5, 'ketchup', '/ketchup_min.webp'),
    (6, 'lettuce', '/lettuce_min.webp'),
    (7, 'onion', '/onion_min.webp'),
    (8, 'cheese', '/cheese_min.webp'),
    (9, 'meat', '/meat_min.webp'),
    (10, 'chicken', '/chicken_min.webp')
ON CONFLICT DO NOTHING;

ALTER SEQUENCE ingredients_id_seq RESTART WITH 11;

INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity) VALUES
    (1, 1, 10, 1),
	(2, 1, 4, 1),
	(3, 1, 1, 2),
	(4, 1, 7, 1),
	(5, 1, 8, 1),
	(6, 1, 5, 1),
	(7, 1, 2, 5),
	(8, 2, 3, 1),
	(9, 2, 1, 1),
	(10, 2, 7, 1),
	(11, 2, 8, 1),
	(12, 2, 5, 1),
	(13, 2, 2, 5),
	(14, 3, 10, 1),
	(15, 3, 6, 1),
	(16, 3, 1, 1),
	(17, 3, 7, 1),
	(18, 3, 2, 3),
	(19, 4, 9, 1),
	(20, 4, 7, 1),
	(21, 4, 5, 2),
	(22, 4, 4, 1),
	(23, 4, 1, 1),
	(24, 5, 10, 1),
	(25, 5, 4, 1),
	(26, 5, 1, 4),
	(27, 5, 7, 1),
	(28, 5, 2, 1),
	(29, 6, 10, 1),
	(30, 6, 3, 1),
	(31, 6, 7, 1),
	(32, 6, 8, 1),
	(33, 6, 2, 1)
ON CONFLICT DO NOTHING;

ALTER SEQUENCE recipe_ingredients_id_seq RESTART WITH 34;

INSERT INTO storage (id, ingredient_id, quantity) VALUES
    (1, 1, 0),
	(2, 2, 1),
	(3, 3, 2),
	(4, 4, 1),
	(5, 5, 2),
	(6, 6, 5),
	(7, 7, 2),
	(8, 8, 2),
	(9, 9, 4),
	(10, 10, 0)
ON CONFLICT DO NOTHING;

ALTER SEQUENCE storage_id_seq RESTART WITH 11;

INSERT INTO users (id, name, email, password) VALUES
    (1, 'Jhon Doe', 'jhon@example.com', 'pbkdf2_sha256$30000$Jvt1ozf0BvOA$1g5Adp49w43H69qjX+VYihZWNbAECM+2xoaGQerzFrY=')
ON CONFLICT DO NOTHING;

ALTER SEQUENCE users_id_seq RESTART WITH 2;