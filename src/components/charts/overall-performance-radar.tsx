'use client'

import { TrendingUp } from 'lucide-react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart
} from 'recharts'

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
  driverOneQualifyingAverage,
  driverTwoQualifyingAverage
}) => {
  const maxValues = {
    'Points (vs. best driver)': bestDriverPoints,
    Points: 672,
    'Average Race Result': 20,
    'Average Grid Position': 20
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
      stat: 'Points',
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
        ((maxValues['Average Grid Position'] - driverOneQualifyingAverage) /
          (maxValues['Average Grid Position'] - 1)) *
        100,
      driverTwo:
        ((maxValues['Average Grid Position'] - driverTwoQualifyingAverage) /
          (maxValues['Average Grid Position'] - 1)) *
        100,
      driverOneOriginal: driverOneQualifyingAverage,
      driverTwoOriginal: driverTwoQualifyingAverage,
      maxValue: maxValues['Average Grid Position']
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
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => {
                    const stat = props.payload
                    const isDriverOne = name === 'driverOne'
                    const driverColor = isDriverOne
                      ? primaryColor
                      : secondaryColor

                    if (!isDriverOne) {
                      return (
                        <div className='flex w-full items-center text-xs text-muted-foreground'>
                          <span style={{ color: driverColor }}>
                            {driverTwo}
                          </span>
                          <div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
                            {stat.driverTwoOriginal}
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div className='flex min-w-[130px] flex-col gap-2'>
                        <div className='text-center text-xs font-medium text-foreground'>
                          {stat.stat}
                          {/* (max: {stat.maxValue}) */}
                        </div>
                        <div className='flex w-full items-center text-xs text-muted-foreground'>
                          <span style={{ color: driverColor }}>
                            {driverOne}
                          </span>
                          <div className='ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground'>
                            {stat.driverOneOriginal}
                          </div>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <PolarAngleAxis
              dataKey='stat'
              tickFormatter={value => {
                // Log to verify what value is being passed
                console.log('Tick value:', value)
                return value
              }}
            />
            {/* Consistent domain after normalization */}
            <PolarGrid radialLines={false} />
            <Radar
              dataKey='driverOne'
              fill={primaryColor}
              fillOpacity={0}
              stroke={primaryColor}
              strokeWidth={2}
            />
            <Radar
              dataKey='driverTwo'
              fill={secondaryColor}
              fillOpacity={0}
              stroke={secondaryColor}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Trending up by 5.2% this stat <TrendingUp className='h-4 w-4' />
        </div>
        <div className='flex items-center gap-2 leading-none text-muted-foreground'>
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  )
}
