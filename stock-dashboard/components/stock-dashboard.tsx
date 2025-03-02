"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/lib/use-toast"
import { calculateMetrics } from "@/lib/calculations"
import PriceChart from "@/components/price-chart"
import CorrelationChart from "@/components/correlation-chart"
import ReturnsDistribution from "@/components/returns-distribution"
import DashboardSkeleton from "@/components/dashboard-skeleton"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  BarChart2,
  DollarSign,
} from "lucide-react"
import type { StockData, CalculatedMetrics } from "@/lib/types"
import { formatNumber, formatPercent } from "@/lib/utils"
import { generateSampleData } from "@/lib/sample-data"
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, LineChart, Line, Legend } from "recharts"

export default function StockDashboard() {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [metrics, setMetrics] = useState<CalculatedMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    try {
      // Use sample data instead of fetching
      const sampleData = generateSampleData()
      setStockData(sampleData)

      // Calculate metrics
      const calculatedMetrics = calculateMetrics(sampleData)
      setMetrics(calculatedMetrics)
      setLoading(false)
    } catch (error) {
      console.error("Error loading sample data:", error)
      toast({
        title: "Error",
        description: "Failed to load stock data. Please try again later.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }, [toast])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center">
          <div className="emoji-icon mr-3">📈</div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Stock Analysis Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground ml-10">Comprehensive analysis of stock performance and metrics ✨</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-glow border-t-4 border-t-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <span className="mr-2">💰</span> Avg. Daily Return
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatPercent(metrics.avgDailyReturn) : <Skeleton className="h-8 w-20" />}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={metrics?.avgDailyReturn && metrics.avgDailyReturn > 0 ? "default" : "destructive"}>
                {metrics?.avgDailyReturn && metrics.avgDailyReturn > 0 ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                Daily
              </Badge>
              <span className="text-xs text-muted-foreground">
                {metrics ? `Std Dev: ${formatPercent(metrics.stdDeviation)}` : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow border-t-4 border-t-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <span className="mr-2">📉</span> Max Drawdown
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {metrics ? formatPercent(metrics.maxDrawdown) : <Skeleton className="h-8 w-20" />}
            </div>
            <p className="text-xs text-muted-foreground">Maximum loss from peak to trough</p>
          </CardContent>
        </Card>

        <Card className="card-glow border-t-4 border-t-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <span className="mr-2">🔥</span> Avg. Volatility
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatPercent(metrics.avgVolatility) : <Skeleton className="h-8 w-20" />}
            </div>
            <p className="text-xs text-muted-foreground">Average price fluctuation</p>
          </CardContent>
        </Card>

        <Card className="card-glow border-t-4 border-t-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              <span className="mr-2">🔄</span> Volume-Price Correlation
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics ? formatNumber(metrics.volumePriceCorrelation) : <Skeleton className="h-8 w-20" />}
            </div>
            <p className="text-xs text-muted-foreground">Relationship between volume and price</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="price-trends" className="space-y-4">
        <TabsList className="bg-muted/60 p-1">
          <TabsTrigger value="price-trends" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <LineChart className="h-4 w-4 mr-2" />
            Price Trends
          </TabsTrigger>
          <TabsTrigger value="returns" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Returns Distribution
          </TabsTrigger>
          <TabsTrigger
            value="correlations"
            className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Correlations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="price-trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2 card-glow">
              <CardHeader>
                <div className="flex items-center">
                  <div className="emoji-icon mr-2 bg-blue-100 dark:bg-blue-900/30">📊</div>
                  <div>
                    <CardTitle>Price Trends with Moving Averages</CardTitle>
                    <CardDescription>Stock price with 20-day and 50-day moving averages</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <PriceChart data={stockData} />
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <div className="flex items-center">
                  <div className="emoji-icon mr-2 bg-purple-100 dark:bg-purple-900/30">🎯</div>
                  <div>
                    <CardTitle>Price Position vs Range</CardTitle>
                    <CardDescription>Scatter plot showing price position within daily range</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <XAxis type="number" dataKey="Price_Position" name="Price Position" unit="%" />
                    <YAxis type="number" dataKey="Daily_Range_Pct" name="Daily Range" unit="%" />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter name="Price Position vs Range" data={stockData} fill="#8b5cf6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="returns" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="card-glow">
              <CardHeader>
                <div className="flex items-center">
                  <div className="emoji-icon mr-2 bg-green-100 dark:bg-green-900/30">📊</div>
                  <div>
                    <CardTitle>Daily Returns Distribution</CardTitle>
                    <CardDescription>Histogram of daily returns frequency</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ReturnsDistribution data={stockData} />
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <div className="flex items-center">
                  <div className="emoji-icon mr-2 bg-orange-100 dark:bg-orange-900/30">📈</div>
                  <div>
                    <CardTitle>Volatility Analysis</CardTitle>
                    <CardDescription>Volatility over time with trend line</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData}>
                    <XAxis dataKey="Date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="Volatility" stroke="#f97316" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="card-glow">
              <CardHeader>
                <div className="flex items-center">
                  <div className="emoji-icon mr-2 bg-indigo-100 dark:bg-indigo-900/30">📊</div>
                  <div>
                    <CardTitle>Volume Ratio Analysis</CardTitle>
                    <CardDescription>Volume ratio over time with price overlay</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData}>
                    <XAxis dataKey="Date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="Volume_Ratio" stroke="#10b981" />
                    <Line yAxisId="right" type="monotone" dataKey="Close" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <div className="flex items-center">
                  <div className="emoji-icon mr-2 bg-pink-100 dark:bg-pink-900/30">🔄</div>
                  <div>
                    <CardTitle>Volume-Price Correlation</CardTitle>
                    <CardDescription>Correlation between volume and price changes</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <CorrelationChart data={stockData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 border border-blue-200 dark:border-blue-900">
        <div className="flex items-center space-x-2">
          <div className="emoji-icon bg-blue-100 dark:bg-blue-900/50">💡</div>
          <h3 className="text-lg font-semibold">Trading Insights</h3>
        </div>
        <div className="mt-2 ml-10 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start space-x-2">
            <span className="text-green-500 text-xl">✓</span>
            <p className="text-sm">
              Average daily return: {metrics ? formatPercent(metrics.avgDailyReturn) : "Loading..."}
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-red-500 text-xl">⚠️</span>
            <p className="text-sm">Maximum drawdown: {metrics ? formatPercent(metrics.maxDrawdown) : "Loading..."}</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-500 text-xl">📊</span>
            <p className="text-sm">Volatility: {metrics ? formatPercent(metrics.avgVolatility) : "Loading..."}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

