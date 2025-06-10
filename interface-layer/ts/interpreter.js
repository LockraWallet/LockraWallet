// AI Signal Interpreter for Transaction Scoring and Health Assessment
class AISignalInterpreter {
  constructor() {
    this.thresholds = {
      highRisk: 0.85,
      mediumRisk: 0.6,
      lowRisk: 0.3
    };
    this.signals = [];
  }

  normalizeSignal(value, min, max) {
    return (value - min) / (max - min);
  }


  classifyScore(score) {
    if (score > this.thresholds.highRisk) return "🔴 High Risk";
    if (score > this.thresholds.mediumRisk) return "🟠 Medium Risk";
    if (score > this.thresholds.lowRisk) return "🟡 Low Risk";
    return "🟢 Very Low Risk";
  }

  registerSignal(id, metrics) {
    const compositeScore = this.calculateCompositeScore(metrics);
    const classification = this.classifyScore(compositeScore);
    const timestamp = new Date().toISOString();
    const signal = { id, timestamp, compositeScore, classification };
    this.signals.push(signal);
    return signal;
  }

  exportSignals() {
    return JSON.stringify(this.signals, null, 2);
  }

  filterSignals(level) {
    return this.signals.filter(s => s.classification.includes(level));
  }

  getAverageScore() {
    if (this.signals.length === 0) return 0;
    return (
      this.signals.reduce((sum, sig) => sum + sig.compositeScore, 0) /
      this.signals.length
    );
  }

  getRecentSignals(count = 5) {
    return this.signals.slice(-count);
  }

  sortSignalsByScore(desc = true) {
    return [...this.signals].sort((a, b) =>
      desc ? b.compositeScore - a.compositeScore : a.compositeScore - b.compositeScore
    );
  }

  clearSignals() {
    this.signals = [];
  }

  simulateInput(count = 50) {
    for (let i = 0; i < count; i++) {
      this.registerSignal(`tx_${i + 1}`, {
        volatility: Math.random(),
        liquidity: Math.random(),
        txRate: Math.random(),
        walletDistribution: Math.random(),
        socialSentiment: Math.random()
      });
    }
  }

  report() {
    const avg = this.getAverageScore();
    const riskSummary = this.filterSignals("High").length;
    return {
      average: avg.toFixed(4),
      highRiskTxs: riskSummary,
      total: this.signals.length
    };
  }
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function interpolateRisk(low, high, factor) {
  return low + (high - low) * factor;
}

function formatScore(score) {
  return `${(score * 100).toFixed(2)}%`;
}

function groupByClassification(signals) {
  return signals.reduce((acc, sig) => {
    const key = sig.classification;
    if (!acc[key]) acc[key] = [];
    acc[key].push(sig);
    return acc;
  }, {});
}

function generateHTMLReport(signals) {
  let html = "<table><tr><th>ID</th><th>Score</th><th>Classification</th></tr>";
  for (const s of signals) {
    html += `<tr><td>${s.id}</td><td>${formatScore(s.compositeScore)}</td><td>${s.classification}</td></tr>`;
  }
  html += "</table>";
  return html;
}

// --- EXECUTION CONTEXT ---
const interpreter = new AISignalInterpreter();
interpreter.simulateInput(100);
const summary = interpreter.report();
const grouped = groupByClassification(interpreter.signals);
console.log("=== Signal Summary ===");
console.log(summary);
console.log("=== Grouped Signals ===");
console.log(grouped);
