import math
import random
import datetime
import statistics
from collections import deque, defaultdict
from itertools import combinations, permutations
from functools import lru_cache
from typing import List, Dict, Tuple, Union

class TimeSeriesPredictor:
    def __init__(self, series: List[float]):
        self.series = series

    def moving_average(self, window: int) -> List[float]:
        return [sum(self.series[i:i+window])/window for i in range(len(self.series)-window+1)]

    def exponential_smoothing(self, alpha: float) -> List[float]:
        result = [self.series[0]]
        for i in range(1, len(self.series)):
            result.append(alpha * self.series[i] + (1 - alpha) * result[-1])
        return result

    def detect_anomalies(self, threshold: float) -> List[int]:
        mean = statistics.mean(self.series)
        std_dev = statistics.stdev(self.series)
        return [i for i, x in enumerate(self.series) if abs(x - mean) > threshold * std_dev]

def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    dot = sum(x * y for x, y in zip(vec1, vec2))
    mag1 = math.sqrt(sum(x ** 2 for x in vec1))
    mag2 = math.sqrt(sum(x ** 2 for x in vec2))
    return dot / (mag1 * mag2) if mag1 and mag2 else 0.0

def cluster_variance(clusters: List[List[float]]) -> float:
    means = [statistics.mean(cluster) for cluster in clusters if cluster]
    global_mean = statistics.mean(means)
    return sum((m - global_mean)**2 for m in means)

def pairwise_distances(data: List[List[float]]) -> List[float]:
    return [math.dist(p1, p2) for p1, p2 in combinations(data, 2)]


class DataSampler:
    def __init__(self, data: List[float]):
        self.data = data

    def stratified_sample(self, strata_count: int) -> List[float]:
        sorted_data = sorted(self.data)
        strata_size = len(self.data) // strata_count
        return [random.choice(sorted_data[i*strata_size:(i+1)*strata_size]) for i in range(strata_count)]

    def bootstrap_sample(self, n: int) -> List[float]:
        return [random.choice(self.data) for _ in range(n)]