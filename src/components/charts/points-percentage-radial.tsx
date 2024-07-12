'use client'

import { TrendingUp } from 'lucide-react'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

interface PointsPercentageRadialProps {
  teamName: string
  teammateAPoints: number
  teammateBPoints: number
  teammateAName: string
  teammateBName: string
  year: number
  color: string
}

export const PointsPercentageRadial = ({
  teamName,
  teammateAPoints,
  teammateBPoints,
  teammateAName,
  teammateBName,
  year,
  color
}: PointsPercentageRadialProps) => {
  const chartData = [
    { season: year, teammateA: teammateAPoints, teammateB: teammateBPoints }
  ]

  const chartConfig = {
    teammateA: {
      label: `${teammateAName}`,
      color: color
    },
    teammateB: {
      label: `${teammateBName}`,
      color: '#f4f4f5'
      // // color: 'hsl(var(--chart-2))'
    }
  } satisfies ChartConfig

  const totalPoints = chartData[0].teammateA + chartData[0].teammateB

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='capitalize'>{teamName}</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square w-full max-w-[250px]'
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className='fill-foreground text-2xl font-bold'
                        >
                          {totalPoints.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className='fill-muted-foreground'
                        >
                          Points
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey='teammateB'
              fill='var(--color-teammateB)'
              stackId='a'
              cornerRadius={5}
              className='stroke-transparent stroke-2'
            />
            <RadialBar
              dataKey='teammateA'
              stackId='a'
              cornerRadius={5}
              fill='var(--color-teammateA)'
              className='stroke-transparent stroke-2'
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        {/* <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div> */}
        <div className='leading-none text-muted-foreground'>
          Showing total points for the {year} season
        </div>
      </CardFooter>
    </Card>
  )
}
