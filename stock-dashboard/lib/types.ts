export interface StockData {
  Date: Date
  Close: number
  Daily_Return: number
  MA20: number
  MA50: number
  Volatility: number
  Volume_Ratio: number
  Daily_Range_Pct: number
  Price_Position: number
}

export interface CalculatedMetrics {
  avgDailyReturn: number
  stdDeviation: number
  maxDrawdown: number
  avgVolatility: number
  volumePriceCorrelation: number
}

