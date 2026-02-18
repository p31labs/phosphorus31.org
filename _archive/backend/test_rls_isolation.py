import asyncio
import os
import uuid
import pytest
import asyncpg
from datetime import datetime, timedelta

# --- Configuration for Test Database ---
# IMPORTANT: Use a dedicated test database to avoid data loss.
TEST_DATABASE_URL = os.getenv(
    "TEST_DATABASE_URL",
    "postgresql://testuser:testpassword@localhost/test_cognitive_shield"
)

# Path to your RLS-enabled schema
INIT_DB_SCRIPT_PATH = "c:/MASTER_PROJECT/67/init_db.sql"

# --- Pytest Fixtures ---

@pytest.fixture(scope="session")
def event_loop():
    """Create a session-scoped event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def db_pool(event_loop):
    """Fixture for an asyncpg connection pool."""
    print(f"\nConnecting to test database: {TEST_DATABASE_URL}")
    try:
        pool = await asyncpg.create_pool(TEST_DATABASE_URL)
        yield pool
    except Exception as e:
        pytest.fail(f"Failed to connect to test database: {e}")
    finally:
        if pool:
            await pool.close()
            print("Test database connection pool closed.")

@pytest.fixture(scope="session")
async def init_db_schema(db_pool):
    """Fixture to initialize the test database schema with RLS policies."""
    async with db_pool.acquire() as conn:
        # Drop existing tables to ensure a clean slate for each test session
        await conn.execute("DROP TRIGGER IF EXISTS trigger_sovereignty_update ON care_ledger;")
        await conn.execute("DROP FUNCTION IF EXISTS update_sovereignty_score();")
        await conn.execute("DROP TRIGGER IF EXISTS trigger_node_last_seen ON care_ledger;")
        await conn.execute("DROP FUNCTION IF EXISTS update_node_last_seen();")
        await conn.execute("DROP FUNCTION IF EXISTS current_node_id();")
        await conn.execute("DROP FUNCTION IF EXISTS role_is_admin();")
        await conn.execute("DROP TABLE IF EXISTS care_ledger CASCADE;")
        await conn.execute("DROP TABLE IF EXISTS dyads CASCADE;")
        await conn.execute("DROP TABLE IF EXISTS nodes CASCADE;")
        await conn.execute("DROP TYPE IF EXISTS node_role;")

        # Read and execute the SQL schema from init_db.sql
        try:
            with open(INIT_DB_SCRIPT_PATH, "r") as f:
                schema_sql = f.read()
            await conn.execute(schema_sql)
            print(f"Schema from {INIT_DB_SCRIPT_PATH} applied.")
        except FileNotFoundError:
            pytest.fail(f"init_db.sql not found at {INIT_DB_SCRIPT_PATH}")
        except Exception as e:
            pytest.fail(f"Error applying schema: {e}")
    yield
    # No explicit teardown here; assume the session scope is sufficient
    # for re-running schema initialization if needed.

@pytest.fixture(scope="function")
async def clean_db_for_function(db_pool, init_db_schema):
    """Cleans tables for each test function, re-applying the schema for a fresh state."""
    async with db_pool.acquire() as conn:
        await conn.execute("TRUNCATE TABLE care_ledger, dyads, nodes RESTART IDENTITY CASCADE;")
    yield


@pytest.fixture(scope="function")
async def test_nodes_and_dyads(db_pool, clean_db_for_function):
    """
    Creates multiple test nodes and dyads for RLS testing.
    Returns: A dictionary of node UUIDs and dyad UUIDs for easy access.
    """
    nodes_data = {}
    async with db_pool.acquire() as conn:
        # Admin Node
        admin_id = uuid.uuid4()
        await conn.execute(
            "INSERT INTO nodes (id, genesis_key_public, role) VALUES ($1, $2, $3)",
            admin_id, f"admin_key_{admin_id}", "ADMIN"
        )
        nodes_data["admin_id"] = admin_id

        # Sovereign Node A
        node_a_id = uuid.uuid4()
        await conn.execute(
            "INSERT INTO nodes (id, genesis_key_public, role) VALUES ($1, $2, $3)",
            node_a_id, f"key_a_{node_a_id}", "SOVEREIGN"
        )
        nodes_data["node_a_id"] = node_a_id

        # Sovereign Node B (partner to A in dyad_1)
        node_b_id = uuid.uuid4()
        await conn.execute(
            "INSERT INTO nodes (id, genesis_key_public, role) VALUES ($1, $2, $3)",
            node_b_id, f"key_b_{node_b_id}", "SOVEREIGN"
        )
        nodes_data["node_b_id"] = node_b_id

        # Sovereign Node C (isolated, not in dyad_1 or dyad_2)
        node_c_id = uuid.uuid4()
        await conn.execute(
            "INSERT INTO nodes (id, genesis_key_public, role) VALUES ($1, $2, $3)",
            node_c_id, f"key_c_{node_c_id}", "SOVEREIGN"
        )
        nodes_data["node_c_id"] = node_c_id

        # Dyad 1 (Node A and Node B)
        dyad_1_id = uuid.uuid4()
        await conn.execute(
            "INSERT INTO dyads (id, tetrahedron_id, node_a_id, node_b_id) VALUES ($1, $2, $3, $4)",
            dyad_1_id, uuid.uuid4(), node_a_id, node_b_id
        )
        nodes_data["dyad_1_id"] = dyad_1_id

        # Dyad 2 (Node A and Node C - for cross-dyad access test)
        dyad_2_id = uuid.uuid4()
        await conn.execute(
            "INSERT INTO dyads (id, tetrahedron_id, node_a_id, node_b_id) VALUES ($1, $2, $3, $4)",
            dyad_2_id, uuid.uuid4(), node_a_id, node_c_id
        )
        nodes_data["dyad_2_id"] = dyad_2_id


        # Populate Care Ledger entries
        # Entry for Dyad 1, Actor A
        await conn.execute(
            """
            INSERT INTO care_ledger (dyad_id, actor_id, event_type, enc_payload, metadata_json, voltage_delta, hw_signature)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            dyad_1_id, node_a_id, "MESSAGE_A_DYAD1", b"payload1", {}, 0.1, b"sig1"
        )
        # Entry for Dyad 1, Actor B
        await conn.execute(
            """
            INSERT INTO care_ledger (dyad_id, actor_id, event_type, enc_payload, metadata_json, voltage_delta, hw_signature)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            dyad_1_id, node_b_id, "MESSAGE_B_DYAD1", b"payload2", {}, 0.2, b"sig2"
        )
         # Entry for Dyad 2, Actor A
        await conn.execute(
            """
            INSERT INTO care_ledger (dyad_id, actor_id, event_type, enc_payload, metadata_json, voltage_delta, hw_signature)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            dyad_2_id, node_a_id, "MESSAGE_A_DYAD2", b"payload3", {}, 0.3, b"sig3"
        )
        # Entry for Dyad 2, Actor C
        await conn.execute(
            """
            INSERT INTO care_ledger (dyad_id, actor_id, event_type, enc_payload, metadata_json, voltage_delta, hw_signature)
            VALUES ($1, $2, $3, $4, $5, $6)
            """,
            dyad_2_id, node_c_id, "MESSAGE_C_DYAD2", b"payload4", {}, 0.4, b"sig4"
        )

    yield nodes_data


# --- Test Functions ---

async def set_user_context(conn, user_id: uuid.UUID = None):
    """Sets the app.current_user_id for the current session."""
    if user_id:
        await conn.execute(f"SET LOCAL app.current_user_id = '{user_id}'")
    else:
        await conn.execute("SET LOCAL app.current_user_id = ''")

@pytest.mark.asyncio
async def test_admin_can_see_all(db_pool, test_nodes_and_dyads):
    """Verify an ADMIN node can see all nodes, dyads, and ledger entries."""
    admin_id = test_nodes_and_dyads["admin_id"]
    async with db_pool.acquire() as conn:
        await set_user_context(conn, admin_id)

        all_nodes = await conn.fetch("SELECT id FROM nodes")
        assert len(all_nodes) == 4 # Admin, A, B, C

        all_dyads = await conn.fetch("SELECT id FROM dyads")
        assert len(all_dyads) == 2 # Dyad 1, Dyad 2

        all_ledger_entries = await conn.fetch("SELECT id FROM care_ledger")
        assert len(all_ledger_entries) == 4 # All entries

@pytest.mark.asyncio
async def test_sovereign_node_sees_only_self(db_pool, test_nodes_and_dyads):
    """Verify a SOVEREIGN node can only see its own node entry."""
    node_a_id = test_nodes_and_dyads["node_a_id"]
    node_b_id = test_nodes_and_dyads["node_b_id"]

    async with db_pool.acquire() as conn:
        await set_user_context(conn, node_a_id)
        nodes_for_a = await conn.fetch("SELECT id FROM nodes")
        assert len(nodes_for_a) == 1
        assert nodes_for_a[0]["id"] == node_a_id

        await set_user_context(conn, node_b_id)
        nodes_for_b = await conn.fetch("SELECT id FROM nodes")
        assert len(nodes_for_b) == 1
        assert nodes_for_b[0]["id"] == node_b_id

@pytest.mark.asyncio
async def test_sovereign_sees_own_dyads(db_pool, test_nodes_and_dyads):
    """Verify a SOVEREIGN node can only see dyads it belongs to."""
    node_a_id = test_nodes_and_dyads["node_a_id"]
    dyad_1_id = test_nodes_and_dyads["dyad_1_id"]
    dyad_2_id = test_nodes_and_dyads["dyad_2_id"]

    async with db_pool.acquire() as conn:
        await set_user_context(conn, node_a_id)
        dyads_for_a = await conn.fetch("SELECT id FROM dyads")
        assert len(dyads_for_a) == 2
        assert {dyad_1_id, dyad_2_id} == {d["id"] for d in dyads_for_a}

        node_c_id = test_nodes_and_dyads["node_c_id"]
        await set_user_context(conn, node_c_id)
        dyads_for_c = await conn.fetch("SELECT id FROM dyads")
        assert len(dyads_for_c) == 1
        assert dyads_for_c[0]["id"] == dyad_2_id # C is only in Dyad 2 with A

@pytest.mark.asyncio
async def test_sovereign_sees_own_ledger_entries(db_pool, test_nodes_and_dyads):
    """Verify a SOVEREIGN node can only see ledger entries for its own dyads."""
    node_a_id = test_nodes_and_dyads["node_a_id"]
    node_b_id = test_nodes_and_dyads["node_b_id"]
    node_c_id = test_nodes_and_dyads["node_c_id"]

    async with db_pool.acquire() as conn:
        await set_user_context(conn, node_a_id)
        ledger_for_a = await conn.fetch("SELECT event_type FROM care_ledger ORDER BY event_type")
        assert len(ledger_for_a) == 4 # All entries from Dyad 1 (A-B) and Dyad 2 (A-C)
        assert {r["event_type"] for r in ledger_for_a} == {"MESSAGE_A_DYAD1", "MESSAGE_B_DYAD1", "MESSAGE_A_DYAD2", "MESSAGE_C_DYAD2"}

        await set_user_context(conn, node_b_id)
        ledger_for_b = await conn.fetch("SELECT event_type FROM care_ledger")
        assert len(ledger_for_b) == 2 # Entries from Dyad 1 only (A-B)
        assert {r["event_type"] for r in ledger_for_b} == {"MESSAGE_A_DYAD1", "MESSAGE_B_DYAD1"}

        await set_user_context(conn, node_c_id)
        ledger_for_c = await conn.fetch("SELECT event_type FROM care_ledger")
        assert len(ledger_for_c) == 2 # Entries from Dyad 2 only (A-C)
        assert {r["event_type"] for r in ledger_for_c} == {"MESSAGE_A_DYAD2", "MESSAGE_C_DYAD2"}


@pytest.mark.asyncio
async def test_sovereign_cannot_see_other_dyads_ledger(db_pool, test_nodes_and_dyads):
    """Verify a SOVEREIGN node cannot see ledger entries for dyads it doesn't belong to."""
    node_a_id = test_nodes_and_dyads["node_a_id"]
    node_b_id = test_nodes_and_dyads["node_b_id"]
    dyad_1_id = test_nodes_and_dyads["dyad_1_id"] # A-B
    dyad_2_id = test_nodes_and_dyads["dyad_2_id"] # A-C

    async with db_pool.acquire() as conn:
        await set_user_context(conn, node_b_id) # Node B is only in Dyad 1
        # Try to query an entry from Dyad 2 (which B is NOT in)
        ledger_entry_from_dyad2 = await conn.fetch("SELECT * FROM care_ledger WHERE dyad_id = $1", dyad_2_id)
        assert len(ledger_entry_from_dyad2) == 0

        await set_user_context(conn, node_c_id) # Node C is only in Dyad 2
        # Try to query an entry from Dyad 1 (which C is NOT in)
        ledger_entry_from_dyad1 = await conn.fetch("SELECT * FROM care_ledger WHERE dyad_id = $1", dyad_1_id)
        assert len(ledger_entry_from_dyad1) == 0

@pytest.mark.asyncio
async def test_sovereignty_score_update(db_pool, test_nodes_and_dyads):
    """Verify the sovereignty_score trigger updates correctly after care_ledger insertion."""
    node_a_id = test_nodes_and_dyads["node_a_id"]
    dyad_1_id = test_nodes_and_dyads["dyad_1_id"]

    async with db_pool.acquire() as conn:
        await set_user_context(conn, node_a_id) # Set context for the trigger's actor_id
        
        # Initial sovereignty score for node_a should be 0 (default)
        initial_score_node_a = await conn.fetchval("SELECT sovereignty_score FROM nodes WHERE id = $1", node_a_id)
        assert initial_score_node_a == 0

        # Insert a new care_ledger entry with high coherence
        await conn.execute(
            """
            INSERT INTO care_ledger (dyad_id, actor_id, event_type, enc_payload, metadata_json, voltage_delta, hw_signature, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            """,
            dyad_1_id, node_a_id, "HIGH_COHERENCE_TEST", b"payload_hc", {}, 0.4, b"sig_hc", datetime.now()
        )
        # Assuming avg_coherence = (0.4 + 0.577) = 0.977, score = 97
        # Fetch updated sovereignty score
        updated_score_node_a = await conn.fetchval("SELECT sovereignty_score FROM nodes WHERE id = $1", node_a_id)
        # Check against expected value based on the trigger's logic (avg_coherence * 100)
        # The initial values for dyad_1 were 0.1 and 0.2 for voltage_delta.
        # Adding 0.577 to these gives 0.677 and 0.777. The new entry is 0.977.
        # Avg for node_a in dyad_1 (assuming previous entries are also for A, which they are not necessarily)
        # Re-evaluating the trigger's logic, it takes `voltage_delta + 0.577` as `avg_coherence`.
        # So for a single entry of 0.4, it would be (0.4 + 0.577) * 100 = 97.7, rounded to 97.
        # However, the trigger averages over the last 24 hours. The fixture populates 2 entries for dyad_1 (0.1, 0.2)
        # And another for dyad_2 (0.3).
        # We need to be careful with the average calculation.
        # If node_a is actor_id, the trigger updates its score based on ALL ledger entries it acted in for dyad_id
        # Let's adjust the expected value based on a simplified test case where it's more direct.
        # For this specific test, we're inserting a new entry for dyad_1 with node_a_id.
        # The existing entries for dyad_1 are actor_id=node_a_id (0.1) and actor_id=node_b_id (0.2).
        # The trigger will consider entries for `dyad_id = NEW.dyad_id` (dyad_1_id) and `created_at > NOW() - INTERVAL '24 hours'`.
        # So it will average the voltage_delta + 0.577 for all entries in dyad_1 within 24h.
        
        # Let's calculate the expected average coherence for dyad_1 with the new entry
        # Existing: (0.1 + 0.577) and (0.2 + 0.577) for dyad_1.
        # New: (0.4 + 0.577)
        # Total voltage_deltas for dyad_1 relevant to trigger: [0.1, 0.2, 0.4]
        # Sum of (voltage_delta + 0.577): (0.1+0.577) + (0.2+0.577) + (0.4+0.577) = 0.677 + 0.777 + 0.977 = 2.431
        # Average: 2.431 / 3 = 0.810333
        # Expected score: round(0.810333 * 100) = 81
        assert updated_score_node_a == 81

        # Test with low coherence to ensure degradation
        await conn.execute(
            """
            INSERT INTO care_ledger (dyad_id, actor_id, event_type, enc_payload, metadata_json, voltage_delta, hw_signature, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            """,
            dyad_1_id, node_a_id, "LOW_COHERENCE_TEST", b"payload_lc", {}, -0.3, b"sig_lc", datetime.now()
        )
        # Existing for dyad_1: [0.1, 0.2, 0.4]. New: -0.3
        # Sum of (voltage_delta + 0.577): (0.1+0.577) + (0.2+0.577) + (0.4+0.577) + (-0.3+0.577) = 0.677 + 0.777 + 0.977 + 0.277 = 2.708
        # Average: 2.708 / 4 = 0.677
        # Expected score: round(0.677 * 100) = 68
        updated_score_node_a_low = await conn.fetchval("SELECT sovereignty_score FROM nodes WHERE id = $1", node_a_id)
        assert updated_score_node_a_low == 68

@pytest.mark.asyncio
async def test_no_user_sees_nothing_by_default(db_pool, test_nodes_and_dyads):
    """Verify that if app.current_user_id is not set, no data is returned by default."""
    async with db_pool.acquire() as conn:
        await set_user_context(conn, None) # Explicitly unset user context

        nodes = await conn.fetch("SELECT id FROM nodes")
        assert len(nodes) == 0

        dyads = await conn.fetch("SELECT id FROM dyads")
        assert len(dyads) == 0

        ledger_entries = await conn.fetch("SELECT id FROM care_ledger")
        assert len(ledger_entries) == 0

