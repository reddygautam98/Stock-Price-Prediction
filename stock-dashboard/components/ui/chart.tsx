"use client"

import type { ReactNode } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  type TooltipProps,
} from "recharts"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: ReactNode
  className?: string
  config?: Record<string, any>
}

export function ChartContainer({ children, className, config }: ChartContainerProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

interface ChartProps {
  type: "line" | "bar" | "scatter"
  data: any[]
  index: string
  categories: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  showLegend?: boolean
  showXGrid?: boolean
  showYGrid?: boolean
  children?: ReactNode
}

export function Chart({
  type,
  data,
  index,
  categories,
  colors = ["#3b82f6", "#8b5cf6", "#f97316", "#10b981", "#ef4444"],
  valueFormatter = (value) => value.toString(),
  showLegend = true,
  showXGrid = false,
  showYGrid = false,
  children,
}: ChartProps) {
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart data={data}>
            {(showXGrid || showYGrid) && (
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={showYGrid}
                vertical={showXGrid}
                stroke="rgba(160, 160, 160, 0.2)"
              />
            )}
            <XAxis
              dataKey={index}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(160, 160, 160, 0.2)" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(160, 160, 160, 0.2)" }}
              tickFormatter={valueFormatter}
            />
            {showLegend && <Legend />}
            {categories.map((category, i) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={colors[i % colors.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            ))}
            {children}
          </LineChart>
        )
      case "bar":
        return (
          <BarChart data={data}>
            {(showXGrid || showYGrid) && (
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={showYGrid}
                vertical={showXGrid}
                stroke="rgba(160, 160, 160, 0.2)"
              />
            )}
            <XAxis
              dataKey={index}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(160, 160, 160, 0.2)" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(160, 160, 160, 0.2)" }}
              tickFormatter={valueFormatter}
            />
            {showLegend && <Legend />}
            {categories.map((category, i) => (
              <Bar key={category} dataKey={category} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
            {children}
          </BarChart>
        )
      case "scatter":
        return (
          <ScatterChart>
            {(showXGrid || showYGrid) && (
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={showYGrid}
                vertical={showXGrid}
                stroke="rgba(160, 160, 160, 0.2)"
              />
            )}
            <XAxis
              type="number"
              dataKey="x"
              name="x"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(160, 160, 160, 0.2)" }}
              tickFormatter={valueFormatter}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="y"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(160, 160, 160, 0.2)" }}
              tickFormatter={valueFormatter}
            />
            {showLegend && <Legend />}
            <Scatter name={categories[0]} data={data} fill={colors[0]} />
            {children}
          </ScatterChart>
        )
      default:
        return null
    }
  }

  return renderChart()
}

interface ChartTooltipProps {
  children?: ReactNode
  className?: string
  cursor?: boolean | object
}

export function ChartTooltip({ children, className, cursor = true }: ChartTooltipProps) {
  return <Tooltip content={children as any} cursor={cursor} wrapperClassName={className} />
}

interface ChartTooltipContentProps {
  className?: string
  children?: ReactNode | ((props: any) => ReactNode)
  hideLabel?: boolean
}

export function ChartTooltipContent({ className, children, hideLabel = false }: ChartTooltipContentProps) {
  return function CustomTooltip(props: TooltipProps<any, any>) {
    const { active, payload, label } = props

    if (!active || !payload || !payload.length) {
      return null
    }

    if (typeof children === "function") {
      return <div className={cn("chart-tooltip", className)}>{children({ ...props, point: payload[0].payload })}</div>
    }

    return (
      <div className={cn("chart-tooltip", className)}>
        {!hideLabel && <p className="text-sm font-medium">{label}</p>}
        {children || (
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center">
                <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                <span className="text-xs">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
}

