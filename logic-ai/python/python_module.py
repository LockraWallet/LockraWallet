
import random
import numpy as np
from typing import List, Dict


class BehavioralEncoder:
    def __init__(self):
        self.sequence_log: List[str] = []

    def encode_action(self, action: str) -> int:
        self.sequence_log.append(action)
        return sum(ord(c) for c in action) % 97



def extract_core_signature(signal: List[float]) -> Dict[str, float]:
    return {
        "median": float(np.median(signal)),
        "variation": float(np.ptp(signal)),
        "harmonic_mean": float(len(signal) / sum(1.0 / x for x in signal if x > 0))
    }



class InteractionEntropyAnalyzer:
    def __init__(self):
        self.records: Dict[str, int] = {}

    def register(self, tag: str):
        self.records[tag] = self.records.get(tag, 0) + 1

    def compute_entropy(self) -> float:
        total = sum(self.records.values())
        probs = [v / total for v in self.records.values()]
        return -sum(p * np.log2(p + 1e-9) for p in probs)


def feedback_variance(measurements: List[float]) -> float:
    if not measurements:
        return 0.0
    avg = sum(measurements) / len(measurements)
    variance = sum((x - avg) ** 2 for x in measurements) / len(measurements)
    return variance



class ConfidenceBandEstimator:
    def __init__(self):
        self.history: List[float] = []

    def add_observation(self, obs: float):
        self.history.append(obs)

    def estimate_band(self) -> Dict[str, float]:
        if len(self.history) < 5:
            return {"low": 0.0, "high": 0.0}
        arr = np.array(self.history)
        return {
            "low": float(np.percentile(arr, 10)),
            "high": float(np.percentile(arr, 90))
        }
