"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/_components/ui/chart";

const pitchSpeedData = [
  { batter: "PWR", stat: 95 },
  { batter: "AVG", stat: 92 },
  { batter: "SPD", stat: 35 },
  { batter: "DEF", stat: 72 },
  { batter: "THR", stat: 80 },
]

const chartConfig = {
  stat: {
    label: "Speed",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function BatterRadarChart() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Player Name</CardTitle>
        <CardDescription>
          Position Player 5 Tools
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-2 aspect-square max-h-[250px]"
        >
          <RadarChart data={pitchSpeedData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="batter" />
            <PolarGrid />
            <Radar
              dataKey="stat"
              fill="var(--color-stat)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Power up 5.2% from last season <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
