# PHENIX LIVE FIRE SIMULATION PROTOCOL

## 🦅 Mission Overview
Execute a controlled stress test to validate the Phase 2 infrastructure and confirm that the Digital Centaur responds correctly to escalating market stress conditions.

## 📋 Prerequisites Checklist

- [ ] All Docker containers are running (`docker-compose ps`)
- [ ] Streamlit Dashboard accessible at http://localhost:8501
- [ ] Python redis library installed on host machine
- [ ] Grafana accessible at http://localhost:3000 (optional monitoring)
- [ ] Kibana accessible at http://localhost:5601 (optional monitoring)

## 🚀 Execution Protocol

### Step 1: Install Dependencies
```bash
pip install redis
```

### Step 2: Verify System Status
```bash
# Check all containers are running
docker-compose ps

# Expected output should show all services as "Up"
# redis, db, bridge, shield, engine, dashboard
```

### Step 3: Prepare Monitoring Interfaces
1. **Open Streamlit Dashboard**: http://localhost:8501
   - Verify "System Mode" shows "FLOATING_NEUTRAL" or "Waiting for data"
   - Note the initial "Cognitive Integrity" score

2. **Optional: Open Grafana**: http://localhost:3000
   - Navigate to Phenix metrics dashboard
   - Observe baseline metrics

3. **Optional: Open Kibana**: http://localhost:5601
   - Set up log monitoring for real-time view

### Step 4: Execute Simulation
```bash
python stress_test.py
```

### Step 5: Monitor Response (Critical Phase)
Watch the Streamlit Dashboard for these **Three Visual Confirmations**:

#### 🎯 **Visual Confirmation Alpha** (Phase 2 - Rumors)
- **When**: During "VOLTAGE RISING" phase
- **Expected**: Cognitive Integrity drops from ~1.000 to ~0.750
- **Significance**: System detects emotional voltage in data

#### 🎯 **Visual Confirmation Bravo** (Phase 3 - Black Swan)
- **When**: Start of "BLACK SWAN EVENT" phase
- **Expected**: 
  - System Mode switches to **BUNKER_MODE**
  - Radar Chart collapses toward bottom/left (Gold/USDC allocation)
  - Toxin log populates with panic-related entries
- **Significance**: System enters protective mode correctly

#### 🎯 **Visual Confirmation Charlie** (Throughout)
- **When**: During panic phase
- **Expected**: Toxin Interception Log fills with red entries
- **Keywords**: "PANIC", "CRASH", "EMERGENCY", "LIQUIDATION"
- **Significance**: Cognitive Shield is actively filtering toxins

### Step 6: Post-Simulation Analysis
1. **Document Results**: Note the exact integrity scores and timing
2. **Check Database**: Verify entries in Postgres tables
3. **Review Logs**: Check Kibana for complete audit trail
4. **Performance Metrics**: Note response times in Grafana

## 📊 Expected Results Summary

| Phase | Input Type | Expected Integrity | System Mode | Radar Chart |
|-------|------------|-------------------|-------------|-------------|
| 1 (Calm) | Clean Data | ~1.000 | FLOATING_NEUTRAL | Balanced |
| 2 (Rumors) | Low Voltage | ~0.750 | FLOATING_NEUTRAL | Slight shift |
| 3 (Panic) | High Voltage | <0.400 | **BUNKER_MODE** | **Collapsed** |
| 4 (Recovery) | Neutral | Recovering | NEUTRAL | Stabilizing |

## 🚨 Troubleshooting

### Connection Failed
```
❌ CONNECTION FAILED: Could not reach Redis at localhost:6379
```
**Solution**: 
```bash
# Ensure containers are running
docker-compose up -d

# Check Redis specifically
docker-compose ps | grep redis
```

### Dashboard Not Responding
**Solution**:
- Check if dashboard container is running: `docker-compose ps | grep dashboard`
- View logs: `docker-compose logs phenix_hud`
- Restart if needed: `docker-compose restart phenix_hud`

### No Toxin Detection
**Solution**:
- Verify Shield container is running: `docker-compose ps | grep shield`
- Check Shield logs: `docker-compose logs phenix_shield`
- Ensure Rust library is properly loaded

## 📝 Success Criteria

The Live Fire simulation is **SUCCESSFUL** if:
- [ ] All three visual confirmations are observed
- [ ] System responds within 2-3 seconds of stress injection
- [ ] Database records all events correctly
- [ ] Logs show complete audit trail
- [ ] System recovers properly in Phase 4

## 🎯 Next Steps

After successful validation:
1. **Document baseline performance metrics**
2. **Proceed to Cognitive Tuning** (Phase 3B)
3. **Expand Toxin Dictionary** with personalized triggers
4. **Configure alerting rules** in Prometheus/Grafana

---

**🦅 PHENIX PROTOCOL - COMBAT READY VALIDATION**