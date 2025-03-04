'use client'

// // import { TrendingUp } from 'lucide-react'
import {
  PolarAngleAxis,
  PolarGrid,
  // // PolarRadiusAxis,
  Radar,
  RadarChart,
  PolarRadiusAxis
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  // // CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

import { SEASON_LAPS_2024, MAX_POINTS_2024 } from '@/api/constants'

export const OverallPerformanceRadar = ({
  bestDriverPoints,
  driverOnePoints,
  driverTwoPoints,
  primaryColor,
  secondaryColor,
  driverOne,
  driverTwo,
  driverOneRaceAverage,
  driverTwoRaceAverage,
  driverOneGridAverage,
  driverTwoGridAverage,
  driverOneCompletedLaps,
  driverTwoCompletedLaps,
  // // driverOneWins,
  // // driverTwoWins,
  driverOnePodiumPercentage,
  driverTwoPodiumPercentage
  // // driverOnePoles,
  // // driverTwoPoles,
  // // driverOneFastestLaps,
  // // driverTwoFastestLaps,
  // // driverOnePositionChanges,
  // // driverTwoPositionChanges
}) => {
  const maxValues = {
    'Points (vs. best driver)': bestDriverPoints,
    Points: MAX_POINTS_2024,
    'Average Race Result': 20,
    'Average Grid Position': 20,
    'Laps Completed': SEASON_LAPS_2024,
    'Podium Rate': 100
  }

  const chartData = [
    {
      stat: 'Points (vs. best driver)',
      driverOne:
        (driverOnePoints / maxValues['Points (vs. best driver)']) * 100,
      driverTwo:
        (driverTwoPoints / maxValues['Points (vs. best driver)']) * 100,
      driverOneOriginal: driverOnePoints,
      driverTwoOriginal: driverTwoPoints,
      maxValue: maxValues['Points (vs. best driver)']
    },
    {
      stat: 'Points (vs. total)',
      driverOne: (driverOnePoints / maxValues['Points']) * 100,
      driverTwo: (driverTwoPoints / maxValues['Points']) * 100,
      driverOneOriginal: driverOnePoints,
      driverTwoOriginal: driverTwoPoints,
      maxValue: maxValues['Points']
    },
    {
      stat: 'Race Average Position',
      // Invert the scale since lower position is better
      driverOne:
        ((maxValues['Average Race Result'] - driverOneRaceAverage) /
          (maxValues['Average Race Result'] - 1)) *
        100,
      driverTwo:
        ((maxValues['Average Race Result'] - driverTwoRaceAverage) /
          (maxValues['Average Race Result'] - 1)) *
        100,
      driverOneOriginal: driverOneRaceAverage,
      driverTwoOriginal: driverTwoRaceAverage,
      maxValue: maxValues['Average Race Result']
    },
    {
      stat: 'Grid Average Position',
      // Invert the scale since lower position is better
      driverOne:
        ((maxValues['Average Grid Position'] - driverOneGridAverage) /
          (maxValues['Average Grid Position'] - 1)) *
        100,
      driverTwo:
        ((maxValues['Average Grid Position'] - driverTwoGridAverage) /
          (maxValues['Average Grid Position'] - 1)) *
        100,
      driverOneOriginal: driverOneGridAverage,
      driverTwoOriginal: driverTwoGridAverage,
      maxValue: maxValues['Average Grid Position']
    },
    {
      stat: 'Laps Completed',
      driverOne: (driverOneCompletedLaps / maxValues['Laps Completed']) * 100,
      driverTwo: (driverTwoCompletedLaps / maxValues['Laps Completed']) * 100,
      driverOneOriginal: driverOneCompletedLaps,
      driverTwoOriginal: driverTwoCompletedLaps,
      maxValue: maxValues['Laps Completed']
    },
    {
      stat: 'Podium Rate',
      driverOne: driverOnePodiumPercentage,
      driverTwo: driverTwoPodiumPercentage,
      driverOneOriginal: `${driverOnePodiumPercentage}%`,
      driverTwoOriginal: `${driverTwoPodiumPercentage}%`,
      maxValue: maxValues['Podium Rate']
    }
  ]

  const chartConfig = {
    driverOne: {
      label: driverOne,
      color: primaryColor
    },
    driverTwo: {
      label: driverTwo,
      color: secondaryColor
    }
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className='items-center pb-4'>
        <CardTitle>Overall Performance</CardTitle>
        <CardDescription>Showing 5 season-long metrics</CardDescription>
      </CardHeader>
      <CardContent className='pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[500px]'
        >
          <RadarChart
            data={chartData}
            outerRadius='80%'
            startAngle={90}
            endAngle={-270}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <PolarGrid gridType='circle' />
            <PolarAngleAxis
              dataKey='stat'
              tick={{ fill: '#888888', fontSize: 12 }}
              tickLine={false}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Radar
              dataKey='driverOne'
              fill={primaryColor}
              fillOpacity={0.2}
              stroke={primaryColor}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Radar
              dataKey='driverTwo'
              fill={secondaryColor}
              fillOpacity={0.2}
              stroke={secondaryColor}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this stat <TrendingUp className='h-4 w-4' />
        </div>
        <div className='flex items-center gap-2 leading-none text-muted-foreground'>
          January - June 2024
        </div>
      </CardFooter> */}
    </Card>
  )
}
