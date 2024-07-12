'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const chartData = [
  { date: '2024-03-03', norris: 8, piastri: 4 }, // Bahrain
  { date: '2024-03-03', norris: 4, piastri: 12 }, // Saudi
  { date: '2024-03-03', norris: 15, piastri: 12 }, // Australia
  { date: '2024-03-03', norris: 10, piastri: 4 }, // Japan
  { date: '2024-03-03', norris: 21, piastri: 6 }, // China
  { date: '2024-03-03', norris: 25, piastri: 3 }, // Miami
  { date: '2024-03-03', norris: 18, piastri: 12 }, // Imola
  { date: '2024-03-03', norris: 12, piastri: 18 }, // Monaco
  { date: '2024-03-03', norris: 18, piastri: 10 }, // Canada
  { date: '2024-03-03', norris: 19, piastri: 6 }, // Spain
  { date: '2024-03-03', norris: 6, piastri: 25 }, // Austria
  { date: '2024-03-03', norris: 15, piastri: 12 } // UK
]

const chartConfig = {
  points: {
    label: 'Points'
  },
  norris: {
    label: 'Norris',
    color: 'hsl(var(--chart-1))'
  },
  piastri: {
    label: 'Piastri',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig

export const SeasonPointsArea = () => {
  const [timeRange, setTimeRange] = React.useState('90d')

  const filteredData = chartData.filter(item => {
    const date = new Date(item.date)
    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    now.setDate(now.getDate() - daysToSubtract)
    return date >= now
  })

  return (
    <Card>
      <CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
        <div className='grid flex-1 gap-1 text-center sm:text-left'>
          <CardTitle>McLaren Teammates Points</CardTitle>
          <CardDescription>
            Showing total points for the 2024 season
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className='w-[160px] rounded-lg sm:ml-auto'
            aria-label='Select a value'
          >
            <SelectValue placeholder='Last 3 months' />
          </SelectTrigger>
          <SelectContent className='rounded-xl'>
            <SelectItem value='90d' className='rounded-lg'>
              Last 3 months
            </SelectItem>
            <SelectItem value='30d' className='rounded-lg'>
              Last 30 days
            </SelectItem>
            <SelectItem value='7d' className='rounded-lg'>
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id='fillNorris' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-norris)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-norris)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillPiastri' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-piastri)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-piastri)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={value => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  }}
                  indicator='dot'
                />
              }
            />
            <Area
              dataKey='piastri'
              type='natural'
              fill='url(#fillPiastri)'
              stroke='var(--color-piastri)'
              stackId='a'
            />
            <Area
              dataKey='norris'
              type='natural'
              fill='url(#fillNorris)'
              stroke='var(--color-norris)'
              stackId='a'
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
