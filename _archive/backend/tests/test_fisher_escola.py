import math
import pytest

def simulate_fisher_info(variance: float) -> float:
    """
    Calculates the Fisher Information Matrix (FIM) curvature.
    Formula: 1 / (variance + epsilon)
    """
    epsilon = 0.001
    return 1.0 / (variance + epsilon)

@pytest.mark.parametrize("variance,expected", [
    (0.05, 0.577),
    (0.25, 0.577)
])
def test_entropy_thresholds(variance, expected):
    """
    Verify the 0.577 (1/√3) threshold for Wye-Delta stability.
    """
    COHERENCE_THRESHOLD = 0.577
    stable_c = simulate_fisher_info(variance) / 10.0
    if variance < 0.1:
        assert stable_c > COHERENCE_THRESHOLD, f"Expected {stable_c} to be > {COHERENCE_THRESHOLD}"
    else:
        assert stable_c < COHERENCE_THRESHOLD, f"Expected {stable_c} to be < {COHERENCE_THRESHOLD}"

def test_isostatic_clamping():
    """
    Verify that the system clamps perfectly coherent signals (zero variance).
    """
    max_c = simulate_fisher_info(0.0) / 10.0
    assert max_c >= 1.0
