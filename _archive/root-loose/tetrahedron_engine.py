import pandas as pd
import numpy as np
from datetime import datetime

# --- CONFIGURATION: The 4 Quadrants of the Portfolio ---
# In the Tetrahedron Protocol, assets are not classes, they are "Anchors".
PORTFOLIO_ANCHORS = {
    "LOGIC": "BTC",          # Cryptographic Truth (Hard Money)
    "HISTORY": "PAXG",       # Gold (Historical Store)
    "MATH": "USDC",          # Stablecoin (Numeraire)
    "STRATEGY": "ETH"        # Programmable Capital (Execution)
}

class TetrahedronEngine:
    def __init__(self):
        self.current_allocations = {k: 0.25 for k in PORTFOLIO_ANCHORS} # Neutral Start (25% each)
        print(f"[{datetime.now()}] TETRAHEDRON ENGINE: Online. Floating Neutral.")

    def calculate_stance(self, integrity_score):
        """
        Converts the Cognitive Shield's 'Integrity Score' into a Portfolio Stance.
        """
        # THE FORMULA: 
        # As integrity drops, we flee from Volatility (Logic/Strategy) to Stability (Math/History).
        
        # Risk Appetite scales linearly with Integrity
        risk_appetite = integrity_score 
        
        # Stability Requirement is the inverse
        stability_need = 1.0 - risk_appetite
        
        # --- NEW ALLOCATION TARGETS ---
        new_weights = {
            "LOGIC": 0.4 * risk_appetite,     # Up to 40% in Risk On
            "STRATEGY": 0.4 * risk_appetite,  # Up to 40% in Risk On
            "HISTORY": 0.1 + (0.4 * stability_need), # Base 10%, scales up to 50% in panic
            "MATH": 0.1 + (0.4 * stability_need)     # Base 10%, scales up to 50% in panic
        }
        
        # Normalize to ensure sum is exactly 1.0
        total_weight = sum(new_weights.values())
        final_weights = {k: v / total_weight for k, v in new_weights.items()}
        
        return final_weights

    def execute_rebalance(self, current_prices, target_weights, total_value):
        """
        Generates the specific Buy/Sell orders to reach the Target Stance.
        """
        print(f"\n--- REBALANCING SIGNAL (Integrity: {integrity_score:.2f}) ---")
        orders = []
        
        for anchor, ticker in PORTFOLIO_ANCHORS.items():
            target_val = total_value * target_weights[anchor]
            current_val = current_prices.get(ticker, 0)
            delta = target_val - current_val
            
            action = "BUY" if delta > 0 else "SELL"
            if abs(delta) > (total_value * 0.01): # 1% Buffer to prevent dust trades
                orders.append(f"{action} ${abs(delta):.2f} of {ticker} ({anchor})")
        
        return orders

# --- SIMULATION WITH CLEAN DATA ---
if __name__ == "__main__":
    engine = TetrahedronEngine()
    
    # 1. Input from Cognitive Shield (Hypothetical)
    # Scenario: The Shield detected "Panic" in the news, reducing integrity.
    integrity_score = 0.35  # "Toxic/Volatile Environment"
    
    # 2. Mock Portfolio Data
    portfolio_value = 100000.00
    market_prices = {"BTC": 45000, "PAXG": 15000, "USDC": 25000, "ETH": 15000} # Mock current holdings
    
    # 3. Calculate New Floating Neutral
    target_stance = engine.calculate_stance(integrity_score)
    
    # 4. Generate Orders
    trade_orders = engine.execute_rebalance(market_prices, target_stance, portfolio_value)
    
    print("\nTARGET TETRAHEDRON SHAPE:")
    for k, v in target_stance.items():
        print(f"  {k}: {v*100:.1f}%")
        
    print("\nEXECUTION ORDERS:")
    for order in trade_orders:
        print(f"  >> {order}")