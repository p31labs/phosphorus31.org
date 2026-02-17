import streamlit as st
import pandas as pd
import psycopg2
import redis
import plotly.graph_objects as go
import plotly.express as px
import os
from streamlit_autorefresh import st_autorefresh

st.set_page_config(page_title="PHENIX HUD", page_icon="🦅", layout="wide")
st_autorefresh(interval=5000, key="data_refresh")

def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "phenix_db"),
        database="phenix_core",
        user="pilot",
        password=os.getenv("DB_PASSWORD", "phenix_secret")
    )

st.title("🦅 PHENIX NAVIGATOR // v2.0")

# METRICS ROW
col1, col2 = st.columns(2)
try:
    conn = get_db()
    df_metrics = pd.read_sql("SELECT * FROM system_metrics ORDER BY timestamp DESC LIMIT 1", conn)
    if not df_metrics.empty:
        integrity = df_metrics.iloc[0]['integrity_score']
        col1.metric("Cognitive Integrity", f"{integrity:.4f}")
        col2.metric("System Mode", df_metrics.iloc[0]['status_mode'])
    else:
        st.warning("System Initializing...")
except Exception as e:
    st.error(f"DB Error: {e}")

# CHARTS ROW
c1, c2 = st.columns([1, 2])
with c1:
    st.subheader("Tetrahedron Stance")
    try:
        df_alloc = pd.read_sql("SELECT * FROM portfolio_snapshots ORDER BY timestamp DESC LIMIT 1", conn)
        if not df_alloc.empty:
            vals = [df_alloc.iloc[0][c] for c in ['alloc_logic_btc', 'alloc_history_paxg', 'alloc_math_usdc', 'alloc_strategy_eth']]
            fig = go.Figure(data=go.Scatterpolar(r=vals, theta=['LOGIC', 'HISTORY', 'MATH', 'STRATEGY'], fill='toself'))
            fig.update_layout(polar=dict(radialaxis=dict(visible=True, range=[0, 0.6])), showlegend=False)
            st.plotly_chart(fig, use_container_width=True)
    except: pass

with c2:
    st.subheader("Integrity Trend")
    try:
        df_hist = pd.read_sql("SELECT timestamp, integrity_score FROM system_metrics ORDER BY timestamp DESC LIMIT 100", conn)
        if not df_hist.empty:
            st.plotly_chart(px.line(df_hist, x='timestamp', y='integrity_score'), use_container_width=True)
    except: pass

st.subheader("🛡️ Toxin Interception Log")
try:
    st.dataframe(pd.read_sql("SELECT timestamp, source, detected_toxins, voltage_level FROM toxin_logs ORDER BY timestamp DESC LIMIT 10", conn), use_container_width=True)
except: pass