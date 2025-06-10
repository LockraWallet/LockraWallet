
import math
import numpy as np
from typing import List, Dict, Optional


class ThresholdSegmenter:
    def __init__(self, threshold: float):
        self.threshold = threshold

    def segment(self, series: List[float]) -> List[List[float]]:
        segments = []
        current = []
        for val in series:
            if val > self.threshold:
                if current:
                    segments.append(current)
                    current = []
            else:
                current.append(val)
        if current:
            segments.append(current)
        return segments


class TimeDecayAggregator:
    def __init__(self, decay_rate: float = 0.95):
        self.decay_rate = decay_rate
        self.current_value = None

    def apply(self, value: float):
        if self.current_value is None:
            self.current_value = value
        else:
            self.current_value = self.decay_rate * self.current_value + (1 - self.decay_rate) * value

    def get(self) -> Optional[float]:
        return self.current_value


def rolling_std(values: List[float], window: int) -> List[float]:
    if len(values) < window:
        return []
    return [float(np.std(values[i:i+window])) for i in range(len(values) - window + 1)]


def frequency_map(data: List[int]) -> Dict[int, int]:
    result = {}
    for x in data:
        result[x] = result.get(x, 0) + 1
    return result


class PredictionBand:
    def __init__(self, margin: float = 0.05):
        self.margin = margin

    def generate(self, base: float) -> Dict[str, float]:
        return {
            "lower_bound": base * (1 - self.margin),
            "upper_bound": base * (1 + self.margin)
        }


def smooth_sequence(seq: List[float], weight: float = 0.1) -> List[float]:
    smoothed = []
    if not seq:
        return smoothed
    current = seq[0]
    for value in seq:
        current = weight * value + (1 - weight) * current
        smoothed.append(current)
    return smoothed


def compare_histograms(hist_a: Dict[int, int], hist_b: Dict[int, int]) -> float:
    keys = set(hist_a.keys()).union(set(hist_b.keys()))
    total = 0.0
    for key in keys:
        total += abs(hist_a.get(key, 0) - hist_b.get(key, 0))
    return total / max(sum(hist_a.values()), 1)


class RareSignalIdentifier:
    def __init__(self):
        self.log: List[float] = []

    def register(self, value: float):
        self.log.append(value)
        if len(self.log) > 200:
            self.log.pop(0)

    def find_outliers(self) -> List[float]:
        if not self.log:
            return []
        median = np.median(self.log)
        mad = np.median([abs(x - median) for x in self.log])
        return [x for x in self.log if abs(x - median) > 3 * mad]


def complexity_measure(signal: List[float]) -> float:
    diffs = [abs(signal[i] - signal[i-1]) for i in range(1, len(signal))]
    return float(np.std(diffs)) / (np.mean(signal) + 1e-8)
