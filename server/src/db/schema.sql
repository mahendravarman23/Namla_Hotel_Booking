CREATE TABLE IF NOT EXISTS hotels (
    id            SERIAL PRIMARY KEY,
    title         VARCHAR(160)     NOT NULL,
    description   TEXT             NOT NULL,
    price         NUMERIC(10, 2)   NOT NULL CHECK (price >= 0),
    latitude      DOUBLE PRECISION NOT NULL CHECK (latitude  BETWEEN  -90 AND  90),
    longitude     DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    image_url     VARCHAR(255)     NOT NULL,
    created_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS hotels_title_idx ON hotels (LOWER(title));
CREATE INDEX IF NOT EXISTS hotels_price_idx ON hotels (price);

CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(120)     NOT NULL,
    email         VARCHAR(255)     UNIQUE NOT NULL,
    password_hash VARCHAR(255)     NOT NULL,
    role          VARCHAR(20)      NOT NULL DEFAULT 'user',
    created_at    TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users (LOWER(email));
