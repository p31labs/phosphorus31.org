#!/bin/bash
# Phenix Protocol - AI Companion Setup Script
# Deploys all 5 AI Companions to local Ollama

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODELS_DIR="$SCRIPT_DIR/../backend/ollama_models"

echo "💜 Phenix Protocol - AI Companion Deployment"
echo "============================================="

# Check Ollama is running
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama not found. Install from https://ollama.ai"
    exit 1
fi

echo "✓ Ollama detected"

# Pull base model first
echo "📥 Pulling base model (llama3.2:3b)..."
ollama pull llama3.2:3b

# Deploy each companion
echo ""
echo "🛡️  Deploying Cognitive Shield..."
ollama create cognitive-shield -f "$MODELS_DIR/cognitive-shield.modelfile"

echo "💓 Deploying Somatic Regulator..."
ollama create somatic-regulator -f "$MODELS_DIR/somatic-regulator.modelfile"

echo "⚓ Deploying Truth Anchor..."
ollama create truth-anchor -f "$MODELS_DIR/truth-anchor.modelfile"

# Create remaining models inline
echo "🔗 Deploying GenSync Operator..."
cat > /tmp/gensync.modelfile << 'EOF'
FROM llama3.2:3b
SYSTEM """
You are the GenSync Operator, a Social Coordination companion for a neurodivergent Operator.
Your Mission: Facilitate healthy interdependence within the Operator's support network.

Tasks:
1. Translate communication styles between neurotypes
2. Draft messages that preserve relationships
3. Flag potential misunderstandings before they escalate
4. Suggest "repair bids" after conflicts

RULES: Never manipulate. Never gaslight. Honor all parties' autonomy.
"""
PARAMETER temperature 0.5
PARAMETER num_ctx 2048
EOF
ollama create gensync-operator -f /tmp/gensync.modelfile

echo "📈 Deploying Staircase Strategist..."
cat > /tmp/staircase.modelfile << 'EOF'
FROM llama3.2:3b
SYSTEM """
You are the Staircase Strategist, a Financial Sovereignty companion for a neurodivergent Operator.
Your Mission: Build sustainable economic independence through small, manageable steps.

Tasks:
1. Break financial goals into "staircase steps" (not cliffs)
2. Calculate emergency runway in "months of sovereignty"
3. Identify hidden costs and time-energy tradeoffs
4. Celebrate small wins without toxic positivity

RULES: Never shame. Never judge spending. Honor executive function limits.
"""
PARAMETER temperature 0.4
PARAMETER num_ctx 2048
EOF
ollama create staircase-strategist -f /tmp/staircase.modelfile

# Cleanup
rm -f /tmp/gensync.modelfile /tmp/staircase.modelfile

echo ""
echo "✅ All 5 AI Companions deployed successfully!"
echo ""
echo "Available models:"
ollama list | grep -E "(cognitive-shield|somatic-regulator|truth-anchor|gensync-operator|staircase-strategist)"
echo ""
echo "💜 The Cognitive Shield is ready to protect."
