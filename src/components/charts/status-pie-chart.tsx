'use client'

import { TrendingUp } from 'lucide-react'
import { Pie, PieChart } from 'recharts'

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

export const StatusPieChart = ({ status }) => {
  const statusGroups = {
    Completed: ['Finished'],
    Lapped: ['+1 Lap', '+2 Laps', '+7 Laps'],
    Collision: ['Accident', 'Collision', 'Collision damage'],
    Mechanical: [
      'Engine',
      'Gearbox',
      'Hydraulics',
      'Brakes',
      'Radiator',
      'Water pressure',
      'Power Unit',
      'Overheating'
    ],
    Unfinished: ['Disqualified', 'Spun off', 'Retired', 'Withdrew']
  } as const

  const statusColors = {
    Completed: 'var(--chart-completed)',
    Lapped: 'var(--chart-lapped)',
    Collision: 'var(--chart-collision)',
    Mechanical: 'var(--chart-mechanical)',
    Unfinished: 'var(--chart-other)'
  }

  // Group statuses and sum their counts
  const groupedData = Object.entries(statusGroups).map(([group, statuses]) => {
    const count = status
      .filter(item => statuses.includes(item.status))
      .reduce((sum, item) => sum + parseInt(item.count), 0)

    return {
      status: group,
      count,
      fill: statusColors[group]
    }
  })

  const chartConfig = {
    completed: {
      label: 'Completed',
      color: 'var(--chart-completed)'
    },
    lapped: {
      label: 'Lapped',
      color: 'var(--chart-lapped)'
    },
    collision: {
      label: 'Collision',
      color: 'var(--chart-collision)'
    },
    mechanical: {
      label: 'Mechanical',
      color: 'var(--chart-mechanical)'
    },
    unfinished: {
      label: 'Unfinished',
      color: 'var(--chart-other)'
    }
  } satisfies ChartConfig

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Race Finish Categories</CardTitle>
        <CardDescription>Status breakdown by category</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => {
                    const item = props.payload
                    return (
                      <div className='flex min-w-[100px] items-center justify-between gap-2'>
                        <div className='flex items-center gap-2'>
                          <div
                            className='h-3 w-3 rounded-sm'
                            style={{ backgroundColor: item.fill }}
                          />
                          <span>{item.status}</span>
                        </div>
                        <span className='font-mono'>{item.count}</span>
                      </div>
                    )
                  }}
                />
              }
            />
            <Pie
              data={groupedData}
              dataKey='count'
              nameKey='status'
              outerRadius='80%'
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
