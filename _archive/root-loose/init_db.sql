-- Phenix Navigator: L.O.V.E. Ledger V2 (RLS Refinement)
-- Purpose: Robust multi-user isolation and role-based sovereignty scores.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Extend Nodes with Roles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'node_role') THEN
        CREATE TYPE node_role AS ENUM ('SOVEREIGN', 'GUARDIAN', 'ADMIN');
    END IF;
END $$;

-- ==================== NODES (Quantum Entities) ====================
CREATE TABLE IF NOT EXISTS nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    genesis_key_public TEXT NOT NULL UNIQUE, -- NXP SE050 public key (hex)
    human_os VARCHAR(20) DEFAULT 'INTEGRATOR', -- Guardian, Order, Achiever, Empath, Integrator
    tetrahedron_id UUID, 
    sovereignty_score INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    role node_role DEFAULT 'SOVEREIGN'
);

-- ==================== DYADS (Quantum Entanglement Pairs) ====================
CREATE TABLE IF NOT EXISTS dyads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tetrahedron_id UUID NOT NULL,
    node_a_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    node_b_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    current_voltage DECIMAL(4,3) DEFAULT 0.0,
    trust_score INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(node_a_id, node_b_id),
    CHECK (node_a_id != node_b_id)
);

-- ==================== CARE_LEDGER (Immutable Quantum Events) ====================
CREATE TABLE IF NOT EXISTS care_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dyad_id UUID REFERENCES dyads(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES nodes(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL, -- 'MESSAGE', 'REPAIR_OFFERED', 'VOLTAGE_SPIKE'
    enc_payload BYTEA NOT NULL, -- ChaCha20-Poly1305 encrypted content
    metadata_json JSONB, -- Ollama CognitivePayload analysis
    voltage_delta DECIMAL(4,3) DEFAULT 0.0,
    hw_signature BYTEA NOT NULL, -- NXP SE050 ECDSA signature
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== ROW LEVEL SECURITY POLICIES ====================
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dyads ENABLE ROW LEVEL SECURITY;
ALTER TABLE care_ledger ENABLE ROW LEVEL SECURITY;

-- users only see themselves
CREATE POLICY nodes_self_policy ON nodes
    USING (id = current_node_id() OR role_is_admin());

-- 2. Refined RLS Policies for Dyads
-- Ensures users can only see dyads where they are a participant.
DROP POLICY IF EXISTS dyads_member_policy ON dyads;
CREATE POLICY dyads_member_policy ON dyads
    FOR ALL
    USING (
        role_is_admin() OR
        node_a_id = current_node_id() OR 
        node_b_id = current_node_id()
    );

-- 3. Refined RLS Policies for Care Ledger
-- Ensures users can only see the history of their own interactions.
DROP POLICY IF EXISTS ledger_dyad_policy ON care_ledger;
CREATE POLICY ledger_dyad_policy ON care_ledger
    FOR SELECT
    USING (
        role_is_admin() OR
        dyad_id IN (
            SELECT id FROM dyads 
            WHERE node_a_id = current_node_id() OR node_b_id = current_node_id()
        )
    );

-- 4. Utility Functions for RLS Context
CREATE OR REPLACE FUNCTION current_node_id() 
RETURNS UUID AS $$
    SELECT NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID;
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION role_is_admin() 
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM nodes 
        WHERE id = current_node_id() AND role = 'ADMIN'
    );
$$ LANGUAGE sql STABLE;

-- ==================== INDEXES ====================
CREATE INDEX idx_ledger_dyad_created ON care_ledger(dyad_id, created_at DESC);
CREATE INDEX idx_nodes_tetrahedron ON nodes(tetrahedron_id);

-- ==================== FUNCTIONS ====================
-- 5. Audit Trigger for Sovereignty Scores
-- Automatically degrades sovereignty if entropy persists over time.
CREATE OR REPLACE FUNCTION update_sovereignty_score()
RETURNS TRIGGER AS $$
DECLARE
    avg_coherence FLOAT;
BEGIN
    SELECT AVG(voltage_delta + 0.577) INTO avg_coherence 
    FROM care_ledger 
    WHERE dyad_id = NEW.dyad_id AND created_at > NOW() - INTERVAL '24 hours';

    UPDATE nodes 
    SET sovereignty_score = GREATEST(0, LEAST(100, (avg_coherence * 100)::INTEGER))
    WHERE id = NEW.actor_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sovereignty_update ON care_ledger;
CREATE TRIGGER trigger_sovereignty_update
    AFTER INSERT ON care_ledger
    FOR EACH ROW EXECUTE FUNCTION update_sovereignty_score();

CREATE OR REPLACE FUNCTION update_node_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE nodes SET last_seen_at = NOW() WHERE id = NEW.actor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_node_last_seen
    AFTER INSERT ON care_ledger
    FOR EACH ROW EXECUTE FUNCTION update_node_last_seen();