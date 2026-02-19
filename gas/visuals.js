/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE CONSTRUCT (Visuals.gs)
 * SYSTEM COMPONENT: Dashboard Data Aggregator
 * Provides structured payloads for frontend rendering:
 *   Spoon gauge, tetrahedron node map, network stability, daily summary.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Get complete dashboard data payload.
 * Called by frontend via google.script.run.getDashboardData()
 */
function getDashboardData() {
  return {
    telemetry: getSystemTelemetry(),
    spoonGauge: getSpoonGauge(),
    narrative: getNarrative(),
    affirmation: getAffirmation(),
    tetrahedron: getTetrahedronMap(),
    recentTelemetry: getRecentTelemetry(10),
    loveSummary: getLoveSummary(5),
    timestamp: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════
// SPOON GAUGE — Visual metabolic state for frontend
// ═══════════════════════════════════════════════════════════════

/**
 * Generate spoon gauge data (for frontend rendering).
 * Returns current/max, percentage, color, and state label.
 */
function getSpoonGauge() {
  const state = getSystemState();
  const current = state.spoons;
  const max = CONFIG.BIO_PHYSICS.MAX_SPOONS;
  const pct = Math.round((current / max) * 100);

  let spoonState = "GREEN";
  if (current <= CONFIG.SECURITY.SAFE_MODE_TRIGGER) spoonState = "RED";
  else if (current <= Math.floor(max / 2)) spoonState = "YELLOW";

  const colorMap = { GREEN: '#22c55e', YELLOW: '#eab308', RED: '#dc2626' };

  return {
    current: current,
    max: max,
    percentage: pct,
    state: spoonState,
    color: colorMap[spoonState],
    label: current + ' / ' + max
  };
}

/**
 * Return the current spoon state string: GREEN, YELLOW, or RED.
 */
function getSpoonState() {
  const state = getSystemState();
  const current = state.spoons;
  const max = CONFIG.BIO_PHYSICS.MAX_SPOONS;

  if (current <= CONFIG.SECURITY.SAFE_MODE_TRIGGER) return "RED";
  if (current <= Math.floor(max / 2)) return "YELLOW";
  return "GREEN";
}

// ═══════════════════════════════════════════════════════════════
// TETRAHEDRON NODE MAP — Network topology visualization
// ═══════════════════════════════════════════════════════════════

/**
 * Generate tetrahedron node map data for the Founding Nodes mesh.
 * Each node has a status and coherence score; edges form full mesh.
 */
function getTetrahedronMap() {
  const nodes = getNodeStatus();

  return {
    nodes: nodes.map(function(n) {
      return {
        id: n.id,
        name: n.name,
        role: n.role,
        status: n.status,
        coherence: n.coherence || 1.0,
        color: n.status === 'ACTIVE' ? '#00e5ff' : '#ef4444'
      };
    }),
    edges: generateEdges(nodes),
    stability: calculateStability(nodes)
  };
}

/**
 * Get node status. In full deployment, reads from state or spreadsheet.
 * Default: returns the operator node + placeholder founding nodes.
 */
function getNodeStatus() {
  const state = getSystemState();

  // If nodes are stored in state, use them
  if (state.nodes && state.nodes.length > 0) {
    return state.nodes;
  }

  // Default node configuration
  return [
    { id: "NODE_001", name: CONFIG.OPERATOR,  role: "OPERATOR",       status: "ACTIVE", coherence: 1.0 },
    { id: "NODE_002", name: "Founding Node 2", role: "FOUNDING_NODE", status: "ACTIVE", coherence: 0.8 },
    { id: "NODE_003", name: "Founding Node 3", role: "FOUNDING_NODE", status: "ACTIVE", coherence: 0.8 },
    { id: "NODE_004", name: "Founding Node 4", role: "FOUNDING_NODE", status: "ACTIVE", coherence: 0.7 }
  ];
}

/**
 * Generate edges between all nodes (full mesh topology).
 * Strength = minimum coherence of the two connected nodes.
 */
function generateEdges(nodes) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      edges.push({
        from: nodes[i].id,
        to: nodes[j].id,
        strength: Math.min(nodes[i].coherence || 1, nodes[j].coherence || 1)
      });
    }
  }
  return edges;
}

/**
 * Calculate network stability (0.00 – 1.00).
 * Product of active ratio and average coherence.
 */
function calculateStability(nodes) {
  if (!nodes || nodes.length === 0) return 0;

  const activeCount = nodes.filter(function(n) { return n.status === 'ACTIVE'; }).length;
  const avgCoherence = nodes.reduce(function(sum, n) { return sum + (n.coherence || 1); }, 0) / nodes.length;

  return Math.round((activeCount / nodes.length) * avgCoherence * 100) / 100;
}

// ═══════════════════════════════════════════════════════════════
// RECENT TELEMETRY & LOVE SUMMARY — Feed data
// ═══════════════════════════════════════════════════════════════

/**
 * Get the N most recent telemetry entries from the spreadsheet.
 */
function getRecentTelemetry(count) {
  count = count || 10;
  const ssId = getMasterSheetId();
  if (!ssId) return [];

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName("Telemetry_Logs");
    if (!sheet || sheet.getLastRow() < 2) return [];

    const startRow = Math.max(2, sheet.getLastRow() - count + 1);
    const numRows = sheet.getLastRow() - startRow + 1;
    const data = sheet.getRange(startRow, 1, numRows, 6).getValues();

    return data.reverse().map(function(row) {
      return {
        timestamp: row[0],
        type: row[1],
        action: row[2],
        context: row[3],
        voltage: row[4],
        status: row[5]
      };
    });
  } catch (e) {
    console.error("Recent telemetry fetch failed:", e);
    return [];
  }
}

/**
 * Get the N most recent LOVE Ledger entries.
 */
function getLoveSummary(count) {
  count = count || 5;
  const ssId = getMasterSheetId();
  if (!ssId) return { entries: [], total: 0 };

  try {
    const ss = SpreadsheetApp.openById(ssId);
    const sheet = ss.getSheetByName("LOVE_Ledger");
    if (!sheet || sheet.getLastRow() < 2) return { entries: [], total: 0 };

    const startRow = Math.max(2, sheet.getLastRow() - count + 1);
    const numRows = sheet.getLastRow() - startRow + 1;
    const data = sheet.getRange(startRow, 1, numRows, 6).getValues();

    const entries = data.reverse().map(function(row) {
      return {
        date: row[0],
        minerId: row[1],
        action: row[2],
        duration: row[3],
        yield: row[4],
        proof: row[5]
      };
    });

    // Total from state
    const state = getSystemState();

    return { entries: entries, total: state.miningYieldTotal || 0 };
  } catch (e) {
    console.error("LOVE summary fetch failed:", e);
    return { entries: [], total: 0 };
  }
}
