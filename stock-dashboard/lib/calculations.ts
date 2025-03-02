import type { StockData, CalculatedMetrics } from "@/lib/types"

export function calculateMetrics(data: StockData[]): CalculatedMetrics {
  // Calculate average daily return
  const dailyReturns = data.map((item) => item.Daily_Return)
  const avgDailyReturn = dailyReturns.reduce((sum, value) => sum + value, 0) / dailyReturns.length

  // Calculate standard deviation of daily returns
  const squaredDiffs = dailyReturns.map((value) => Math.pow(value - avgDailyReturn, 2))
  const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / squaredDiffs.length
  const stdDeviation = Math.sqrt(variance)

  // Calculate maximum drawdown
  let maxDrawdown = 0
  let peak = data[0].Close

  for (const item of data) {
    if (item.Close > peak) {
      peak = item.Close
    }
    const drawdown = ((peak - item.Close) / peak) * 100
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }

  // Calculate average volatility
  const avgVolatility = data.reduce((sum, item) => sum + item.Volatility, 0) / data.length

  // Calculate volume-price correlation
  const volumeRatios = data.map((item) => item.Volume_Ratio)
  const prices = data.map((item) => item.Close)
  const volumePriceCorrelation = calculateCorrelation(volumeRatios, prices)

  return {
    avgDailyReturn,
    stdDeviation,
    maxDrawdown,
    avgVolatility,
    volumePriceCorrelation,
  }
}

// Helper function to calculate correlation coefficient
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length
  const xMean = x.reduce((sum, val) => sum + val, 0) / n
  const yMean = y.reduce((sum, val) => sum + val, 0) / n

  let covariance = 0
  let xVariance = 0
  let yVariance = 0

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean
    const yDiff = y[i] - yMean
    covariance += xDiff * yDiff
    xVariance += xDiff * xDiff
    yVariance += yDiff * yDiff
  }

  return covariance / (Math.sqrt(xVariance) * Math.sqrt(yVariance))
}

