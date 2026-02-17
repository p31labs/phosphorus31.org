-- PHENIX PROTOCOL V2.0 SCHEMA
-- Database schema for the Phenix system

-- 1. SYSTEM METRICS (Integrity Score)
-- Tracks the cognitive integrity of the system over time
CREATE TABLE system_metrics (
    id VARCHAR(36) PRIMARY KEY,
    timestamp DATETIME DEFAULT GETDATE(),
    integrity_score DECIMAL(5, 4) NOT NULL,
    status_mode VARCHAR(20) NOT NULL,
    active_toxins INT DEFAULT 0
);

-- 2. TOXIN LOGS (Immune System)
-- Audits every signal blocked by the Cognitive Shield
CREATE TABLE toxin_logs (
    id VARCHAR(36) PRIMARY KEY,
    timestamp DATETIME DEFAULT GETDATE(),
    source VARCHAR(100),
    raw_content_hash VARCHAR(64),
    detected_toxins VARCHAR(255),
    voltage_level DECIMAL(5, 4)
);

-- 3. PORTFOLIO SNAPSHOTS (Geometry)
-- Records the tetrahedron allocation geometry over time
CREATE TABLE portfolio_snapshots (
    id VARCHAR(36) PRIMARY KEY,
    timestamp DATETIME DEFAULT GETDATE(),
    total_value_usd DECIMAL(12, 2),
    alloc_logic_btc DECIMAL(5, 4),
    alloc_history_paxg DECIMAL(5, 4),
    alloc_math_usdc DECIMAL(5, 4),
    alloc_strategy_eth DECIMAL(5, 4)
);

-- 4. TRADE HISTORY (Execution)
-- Execution log for all trading actions
CREATE TABLE trade_history (
    id VARCHAR(36) PRIMARY KEY,
    timestamp DATETIME DEFAULT GETDATE(),
    action VARCHAR(10),
    asset VARCHAR(10),
    amount DECIMAL(18, 8),
    price_usd DECIMAL(12, 2),
    trigger_reason VARCHAR(255)
);

-- Create indexes for dashboard performance
CREATE INDEX idx_metrics_time ON system_metrics(timestamp DESC);
CREATE INDEX idx_snapshots_time ON portfolio_snapshots(timestamp DESC);
