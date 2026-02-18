-- P31 Geodesic Platform — initial schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    coherence_balance INTEGER DEFAULT 1000,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

CREATE TABLE worlds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT DEFAULT 'public',
    structures JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    coherence_value INTEGER DEFAULT 0,
    visitor_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    world_id UUID REFERENCES worlds(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT,
    vertices JSONB NOT NULL,
    edges JSONB NOT NULL,
    analysis_result JSONB,
    stability FLOAT,
    coherence_bonus FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER,
    thumbnail_url TEXT,
    structure_data JSONB,
    listed BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_user UUID REFERENCES users(id),
    to_user UUID REFERENCES users(id),
    asset_id UUID REFERENCES assets(id),
    amount INTEGER,
    type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE portals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_world_id UUID REFERENCES worlds(id) ON DELETE CASCADE,
    target_world_id UUID REFERENCES worlds(id) ON DELETE CASCADE,
    source_position JSONB,
    target_position JSONB,
    owner_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    coherence_cost FLOAT DEFAULT 10.0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_worlds_owner ON worlds(owner_id);
CREATE INDEX idx_structures_world ON structures(world_id);
CREATE INDEX idx_assets_listed ON assets(listed) WHERE listed = true;
CREATE INDEX idx_portals_active ON portals(is_active) WHERE is_active = true;
