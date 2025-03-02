"use client"

import { useMemo } from "react"
import type { StockData } from "@/lib/types"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

interface ReturnsDistributionProps {
  data: StockData[]
}

export default function ReturnsDistribution({ data }: ReturnsDistributionProps) {
  const histogramData = useMemo(() => {
    const bins = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]
    const counts = Array(bins.length - 1).fill(0)

    data.forEach((item) => {
      const returnValue = item.Daily_Return
      for (let i = 0; i < bins.length - 1; i++) {
        if (returnValue >= bins[i] && returnValue < bins[i + 1]) {
          counts[i]++
          break
        }
      }
    })

    return counts.map((count, i) => ({
      bin: `${bins[i]} to ${bins[i + 1]}%`,
      count,
    }))
  }, [data])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={histogramData}>
        <XAxis dataKey="bin" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}

