-- migrate:up
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    github_id BIGINT UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL
);

-- migrate:down
DROP TABLE users;
