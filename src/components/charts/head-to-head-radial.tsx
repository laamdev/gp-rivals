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

export const HeadToHeadRadial = ({
  driverOne,
  driverTwo,
  primaryColor,
  secondaryColor,
  year,
  team,
  competition,
  totalRaces,
  driverOneValue,
  driverTwoValue
}) => {
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

  const chartData = [
    {
      id: `${competition}-comparison`,
      competition: competition,
      driverOne: driverOneValue,
      driverTwo: driverTwoValue
    }
  ]

  // // const totalVisitors = chartData[0].desktop + chartData[0].mobile

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='capitalize'>{`${competition}s`}</CardTitle>
        <CardDescription>{`${team}`}</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-1 items-center pb-0'>
        <ChartContainer
          key={`${competition}-${driverOne}-${driverTwo}`}
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
                          {totalRaces}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className='fill-muted-foreground'
                        >
                          {`${competition}s`}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              key={`${driverOne}-bar`}
              dataKey='driverOne'
              stackId='a'
              cornerRadius={5}
              fill={primaryColor}
              className='stroke-transparent stroke-2'
            />
            <RadialBar
              key={`${driverTwo}-bar`}
              dataKey='driverTwo'
              fill={secondaryColor}
              stackId='a'
              cornerRadius={5}
              className='stroke-transparent stroke-2'
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-center text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          {`${driverOne} has finished ahead of ${driverTwo} in ${driverOneValue} ${competition}s`}
          {/* Trending up by 5.2% this month <TrendingUp className='h-4 w-4' /> */}
        </div>
        {/* <div className='leading-none text-muted-foreground'>
          {`Showing head-to-head in the ${totalRaces} ${competition}s of the ${year} season.`}
        </div> */}
      </CardFooter>
    </Card>
  )
}
