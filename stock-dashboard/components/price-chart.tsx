"use client"

import type { StockData } from "@/lib/types"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface PriceChartProps {
  data: StockData[]
}

export default function PriceChart({ data }: PriceChartProps) {
  const chartData = data.map((item) => ({
    date: item.Date.toLocaleDateString(),
    Price: item.Close,
    MA20: item.MA20,
    MA50: item.MA50,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Price" stroke="#3b82f6" dot={false} />
        <Line type="monotone" dataKey="MA20" stroke="#f97316" dot={false} />
        <Line type="monotone" dataKey="MA50" stroke="#10b981" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

