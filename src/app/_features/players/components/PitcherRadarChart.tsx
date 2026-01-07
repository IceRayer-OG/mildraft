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
  { pitch: "4SFB", speed: 95 },
  { pitch: "2SFB", speed: 92 },
  { pitch: "CB", speed: 88 },
  { pitch: "CU", speed: 84 },
  { pitch: "SL", speed: 90 },
]

const chartConfig = {
  speed: {
    label: "Speed",
    color: "hsl(var(--chart-1))",
  },
  percent: {
    label: "Percent",
    color: "var(--chart-2)",
  }
} satisfies ChartConfig

export function PitcherRadarChart() {
  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Player Name</CardTitle>
        <CardDescription>
          Pitch Speed by Pitch Type
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-2 aspect-square max-h-62.5"
        >
          <RadarChart data={pitchSpeedData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="pitch" />
            <PolarGrid />
            <Radar
              dataKey="speed"
              fill="var(--color-speed)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="size-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
