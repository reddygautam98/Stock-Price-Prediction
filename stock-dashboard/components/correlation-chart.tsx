"use client"

import type { StockData } from "@/lib/types"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip } from "recharts"

interface CorrelationChartProps {
  data: StockData[]
}

export default function CorrelationChart({ data }: CorrelationChartProps) {
  const scatterData = data.map((item) => ({
    x: item.Volume_Ratio,
    y: item.Daily_Return,
    date: item.Date.toLocaleDateString(),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart>
        <XAxis type="number" dataKey="x" name="Volume Ratio" />
        <YAxis type="number" dataKey="y" name="Daily Return" unit="%" />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Scatter name="Volume-Price Correlation" data={scatterData} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}

