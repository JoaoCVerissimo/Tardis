'use client'

import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

// Define interface for data points expected by the chart
interface ChartDataPoint {
  year: number
  totalInvested: number // Keep for potential future use in tooltip?
  interestEarned: number
  totalBalance: number
}

// Define props for the component
interface AccountingAreaChartProps {
  data: ChartDataPoint[]
}

// Update chartConfig to reflect the stacked components
const chartConfig = {
  totalInvested: {
    label: 'Total Invested',
    color: 'hsl(var(--chart-1))', // Use primary color for investment
  },
  interestEarned: {
    label: 'Interest Earned',
    color: 'hsl(var(--chart-2))', // Use secondary color for interest
  },
} satisfies ChartConfig

// Update function signature to accept props
export function AccountingAreaChart({ data }: AccountingAreaChartProps) {
  // Determine the date range from the data
  const startYear = data.length > 0 ? data[0].year : new Date().getFullYear()
  const endYear =
    data.length > 0 ? data[data.length - 1].year : new Date().getFullYear()
  const yearRange =
    startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Balance Composition</CardTitle>
        <CardDescription>
          Showing the breakdown of total balance into invested capital and
          interest earned over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data} // Use the passed data prop
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year" // Use 'year' for the x-axis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // tickFormatter={(value) => value.slice(0, 3)} // Keep full year
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            {/* Ensure the fill/stroke use the correct CSS variable names */}
            {/* Stack Interest Earned */}
            <Area
              dataKey="interestEarned"
              type="natural"
              fill="var(--color-chart-2)" // Color for interest
              fillOpacity={0.4}
              stroke="var(--color-chart-2)"
              stackId="a" // Same stackId to stack areas
            />
            {/* Stack Total Invested below Interest Earned */}
            <Area
              dataKey="totalInvested"
              type="natural"
              fill="var(--color-chart-1)" // Color for investment
              fillOpacity={0.4}
              stroke="var(--color-chart-1)"
              stackId="a" // Same stackId to stack areas
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending up <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {yearRange} {/* Use calculated year range */}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
