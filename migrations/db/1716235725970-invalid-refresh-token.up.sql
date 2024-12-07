create table if not exists invalid_refresh_token (
    token text PRIMARY KEY,
    created_at timestamptz default current_timestamp not null
);
