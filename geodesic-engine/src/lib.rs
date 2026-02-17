//! P31 Geodesic Engine — structure analysis (Maxwell, stability, fractal dimension).
//! Build for web: wasm-pack build --target web --out-dir ../ui/src/wasm
//! Build for Node: wasm-pack build --target nodejs --out-dir ../geodesic-platform/server/wasm

use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize)]
pub struct AnalysisResult {
    pub stability: f32,
    pub maxwell_valid: bool,
    pub weak_points: Vec<usize>,
    pub stress: Vec<f32>,
    pub natural_frequencies: Vec<f32>,
    pub fractal_dimension: f32,
    pub coherence_bonus: f32,
}

#[wasm_bindgen]
pub fn analyze_structure(vertices: &[f64], edges: &[u32]) -> JsValue {
    let points: Vec<nalgebra::Point3<f64>> = vertices
        .chunks(3)
        .filter(|c| c.len() == 3)
        .map(|c| nalgebra::Point3::new(c[0], c[1], c[2]))
        .collect();
    let connections: Vec<[usize; 2]> = edges
        .chunks(2)
        .filter(|c| c.len() == 2)
        .map(|c| [c[0] as usize, c[1] as usize])
        .collect();

    let v = points.len();
    let e = connections.len();
    let maxwell_valid = (e as i32) >= (3 * v as i32 - 6);

    let mut degree = vec![0usize; v];
    for conn in &connections {
        let [a, b] = *conn;
        if a < v {
            degree[a] += 1;
        }
        if b < v {
            degree[b] += 1;
        }
    }

    let mut stability = 0.5f32;
    if maxwell_valid {
        let avg_degree = degree.iter().sum::<usize>() as f32 / v as f32;
        let degree_variance = degree
            .iter()
            .map(|&d| (d as f32 - avg_degree).powi(2))
            .sum::<f32>()
            / v as f32;
        stability = 0.6 + 0.3 * (avg_degree / 6.0) - 0.1 * (degree_variance / 4.0).min(1.0);
        stability = stability.clamp(0.0, 1.0);
    }

    let weak_points: Vec<usize> = degree
        .iter()
        .enumerate()
        .filter(|(_, &d)| d < 3)
        .map(|(i, _)| i)
        .collect();

    let fractal_dimension = compute_fractal_dimension(&points, &connections);
    let coherence_bonus = if fractal_dimension > 2.5 {
        0.15
    } else if fractal_dimension > 2.0 {
        0.08
    } else {
        0.0
    };

    let stress = if maxwell_valid {
        let lengths: Vec<f64> = connections
            .iter()
            .map(|&[a, b]| nalgebra::distance(&points[a], &points[b]))
            .collect();
        let max_length = lengths.iter().cloned().fold(0.0f64, f64::max);
        if max_length > 1e-10 {
            lengths.iter().map(|&l| (l / max_length) as f32).collect()
        } else {
            vec![0.0; lengths.len()]
        }
    } else {
        vec![0.0; connections.len()]
    };

    let result = AnalysisResult {
        stability,
        maxwell_valid,
        weak_points,
        stress,
        natural_frequencies: vec![1.0, 2.3, 3.7],
        fractal_dimension: fractal_dimension as f32,
        coherence_bonus,
    };
    serde_wasm_bindgen::to_value(&result).unwrap()
}

fn compute_fractal_dimension(
    points: &[nalgebra::Point3<f64>],
    _edges: &[[usize; 2]],
) -> f64 {
    if points.is_empty() {
        return 1.0;
    }
    let (minx, maxx, miny, maxy, minz, maxz) = points.iter().fold(
        (
            f64::INFINITY,
            f64::NEG_INFINITY,
            f64::INFINITY,
            f64::NEG_INFINITY,
            f64::INFINITY,
            f64::NEG_INFINITY,
        ),
        |(minx, maxx, miny, maxy, minz, maxz), p| {
            (
                minx.min(p.x),
                maxx.max(p.x),
                miny.min(p.y),
                maxy.max(p.y),
                minz.min(p.z),
                maxz.max(p.z),
            )
        },
    );
    let size = (maxx - minx).max(maxy - miny).max(maxz - minz);
    if size < 1e-6 {
        return 1.0;
    }
    let scales = [4.0_f64, 8.0, 16.0, 32.0];
    let mut counts = Vec::new();
    for &scale in &scales {
        let box_size = size / scale;
        let mut boxes = std::collections::HashSet::new();
        for p in points {
            let bx = ((p.x - minx) / box_size) as i32;
            let by = ((p.y - miny) / box_size) as i32;
            let bz = ((p.z - minz) / box_size) as i32;
            boxes.insert((bx, by, bz));
        }
        counts.push((scale.ln(), boxes.len() as f64));
    }
    let n = counts.len() as f64;
    let sum_x: f64 = counts.iter().map(|(x, _)| x).sum();
    let sum_y: f64 = counts.iter().map(|(_, y)| (*y + 1e-10).ln()).sum();
    let sum_xy: f64 = counts.iter().map(|(x, y)| x * (*y + 1e-10).ln()).sum();
    let sum_x2: f64 = counts.iter().map(|(x, _)| x * x).sum();
    let denom = n * sum_x2 - sum_x * sum_x;
    if denom.abs() < 1e-10 {
        return 1.0;
    }
    ((n * sum_xy - sum_x * sum_y) / denom).abs()
}
