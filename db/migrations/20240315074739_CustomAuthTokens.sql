-- migrate:up
CREATE TABLE IF NOT EXISTS custom_auth_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id),
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    access_token_expires_in TIMESTAMP WITH TIME ZONE NOT NULL,
    refresh_token_expires_in TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- migrate:down
DROP TABLE custom_auth_tokens
