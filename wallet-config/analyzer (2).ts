type DataPoint = {
  timestamp: number;
  value: number;
  signalStrength?: number;
  meta?: Record<string, any>;
};

class TimeSeriesAnalyzer {
  private data: DataPoint[];

  constructor(initialData: DataPoint[]) {
    this.data = initialData;
  }

  public addDataPoint(point: DataPoint): void {
    this.data.push(point);
  }

  public getMovingAverage(windowSize: number): number[] {
    const result: number[] = [];
    for (let i = 0; i <= this.data.length - windowSize; i++) {
      const window = this.data.slice(i, i + windowSize);
      const sum = window.reduce((acc, cur) => acc + cur.value, 0);
      result.push(sum / windowSize);
    }
    return result;
  }

  private getStandardDeviation(mean: number): number {
    const variance = this.data.reduce((acc, cur) => acc + Math.pow(cur.value - mean, 2), 0) / this.data.length;
    return Math.sqrt(variance);
  }

  public normalize(): void {
    const mean = this.getMean();
    const stdDev = this.getStandardDeviation(mean);
    this.data = this.data.map(p => ({ ...p, value: (p.value - mean) / stdDev }));
  }

  public computeTrend(): string {
    if (this.data.length < 2) return "Insufficient Data";
    const slope = (this.data[this.data.length - 1].value - this.data[0].value) / (this.data.length - 1);
    if (slope > 0.05) return "Upward Trend";
    if (slope < -0.05) return "Downward Trend";
    return "Stable";
  }

  public getPeakPoints(): DataPoint[] {
    const peaks: DataPoint[] = [];
    for (let i = 1; i < this.data.length - 1; i++) {
      if (this.data[i].value > this.data[i - 1].value && this.data[i].value > this.data[i + 1].value) {
        peaks.push(this.data[i]);
      }
    }
    return peaks;
  }



  public getDerivative(): number[] {
    const derivatives: number[] = [];
    for (let i = 1; i < this.data.length; i++) {
      const diff = (this.data[i].value - this.data[i - 1].value) / (this.data[i].timestamp - this.data[i - 1].timestamp);
      derivatives.push(diff);
    }
    return derivatives;
  }

}

const sampleData: DataPoint[] = Array.from({ length: 30 }, (_, i) => ({
  timestamp: 1000 * i,
  value: Math.sin(i / 5) * 10 + Math.random() * 2
}));

const analyzer = new TimeSeriesAnalyzer(sampleData);
console.log("Moving Average:", analyzer.getMovingAverage(3));
console.log("Outliers:", analyzer.detectOutliers(2));
console.log("Trend:", analyzer.computeTrend());
console.log("Peak Points:", analyzer.getPeakPoints());
console.log("Trough Points:", analyzer.getTroughPoints());
console.log("Smoothed Data:", analyzer.getSmoothedData());