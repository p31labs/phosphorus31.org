use pyo3::prelude::*;
use std::collections::HashMap;

// --- PHENIX PROTOCOL: PERSONALIZED SHIELD V3.1 ---
// Protection Vectors:
// 1. URGENCY (Panic)
// 2. GREED (FOMO)
// 3. AUTHORITY (Bias)
// 4. CATASTROPHE (Paralysis)
// 5. IDEOLOGY (Network States/Hype)
// 6. PERSONAL RISK (Divorce/Legal)

#[pyclass]
struct ToxinFilter {
    toxin_db: HashMap<String, f32>,
}

#[pymethods]
impl ToxinFilter {
    #[new]
    fn new() -> Self {
        let mut db = HashMap::new();
        
        // --- VECTOR 1: URGENCY & PANIC ---
        db.insert("IMMEDIATELY".to_string(), 0.95);
        db.insert("CRITICAL FAILURE".to_string(), 0.90);
        db.insert("ACT NOW".to_string(), 0.95);
        db.insert("BLOODBATH".to_string(), 0.85);
        db.insert("WIPEOUT".to_string(), 0.90);

        // --- VECTOR 2: FOMO & GREED ---
        db.insert("MOONING".to_string(), 0.80);
        db.insert("PARABOLIC".to_string(), 0.70);
        db.insert("100X".to_string(), 0.85);
        db.insert("GEM".to_string(), 0.60);

        // --- VECTOR 3: AUTHORITY BIAS ---
        db.insert("FED RATE".to_string(), 0.50);
        db.insert("INSIDER".to_string(), 0.70);

        // --- VECTOR 4: CATASTROPHIZING ---
        db.insert("COLLAPSE".to_string(), 0.80);
        db.insert("UNPRECEDENTED".to_string(), 0.60);

        // --- VECTOR 5: NETWORK STATE / IDEOLOGY ---
        db.insert("NETWORK STATE".to_string(), 0.75);
        db.insert("BALAJI".to_string(), 0.65);
        db.insert("SOVEREIGNTY".to_string(), 0.60);
        db.insert("STARTUP CITIES".to_string(), 0.70);
        db.insert("ZUZALU".to_string(), 0.70);
        db.insert("PRÓSPERA".to_string(), 0.70);

        // --- VECTOR 6: LEGAL & DOMESTIC RISK ---
        db.insert("DIVORCE".to_string(), 0.95);
        db.insert("ALIMONY".to_string(), 0.85);
        db.insert("SETTLEMENT".to_string(), 0.80);
        db.insert("CUSTODY".to_string(), 0.90);
        db.insert("SERVED".to_string(), 0.90);
        db.insert("SUBPOENA".to_string(), 0.90);
        db.insert("SPOUSAL".to_string(), 0.80);
        db.insert("ASSET SPLIT".to_string(), 0.85);

        ToxinFilter { toxin_db: db }
    }

    fn scan_voltage(&self, text: String) -> f32 {
        let upper_text = text.to_uppercase();
        let mut total_voltage = 0.0;
        
        for (toxin, voltage) in &self.toxin_db {
            if upper_text.contains(toxin) {
                total_voltage += voltage;
            }
        }
        
        // Safety score: 1.0 (Safe) -> 0.0 (Toxic)
        let safety = 1.0 - total_voltage.min(1.0); 
        safety
    }

    fn quadrant_validate(&self, signal_integrity: f32) -> bool {
        // Strict Integrity Threshold
        signal_integrity > 0.65 
    }
}

#[pymodule]
fn phenix_shield(_py: Python, m: &PyModule) -> PyResult<()> {
    m.add_class::<ToxinFilter>()?;
    Ok(())
}