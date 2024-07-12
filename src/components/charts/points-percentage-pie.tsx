'use client'

import * as React from 'react'
import { Label, Pie, PieChart } from 'recharts'

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
import { getPercentage } from '@/lib/utils'
import { TrophyIcon } from 'lucide-react'

interface PointsPercentagePieProps {
  teamName: string
  teammateAPoints: number
  teammateBPoints: number
  teammateAName: string
  teammateBName: string
  year: number
  color: string
}

export const PointsPercentagePie = ({
  teamName,
  teammateAPoints,
  teammateBPoints,
  teammateAName,
  teammateBName,
  year,
  color
}: PointsPercentagePieProps) => {
  // // const totalVisitors = React.useMemo(() => {
  // //   return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  // // }, [])

  const chartData = [
    { driver: 'teammateA', points: teammateAPoints, fill: color },
    { driver: 'teammateB', points: teammateBPoints, fill: '#f4f4f5' }
  ]

  const chartConfig = {
    points: {
      label: 'Points'
    },
    teammateA: {
      label: teammateAName,
      color: color
    },
    teammateB: {
      label: teammateBName,
      color: '#f4f4f5'
    }
  } satisfies ChartConfig

  const totalPoints = teammateAPoints + teammateBPoints

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>{teamName}</CardTitle>
        <CardDescription>2024</CardDescription>
      </CardHeader>

      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='points'
              nameKey='driver'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {/* {totalPoints.toLocaleString()} */}
                          {totalPoints}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Points
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          {teammateAPoints > teammateBPoints
            ? `${teammateAName} has scored ${getPercentage(teammateAPoints, totalPoints)}% of the team's points`
            : `${teammateBName} has scored ${getPercentage(teammateAPoints, totalPoints)}% of the team's points`}
          <TrophyIcon
            className='h-4 w-4'
            style={{
              color: teammateAPoints > teammateBPoints ? color : '#f4f4f5'
            }}
          />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing {teamName}'s points for the {year} season
        </div>
      </CardFooter>
    </Card>
  )
}
