'use client'

import { TrendingUp } from 'lucide-react'
import { LabelList, RadialBar, RadialBarChart } from 'recharts'

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

export const DriverStatusRadial = ({ statusDetails }) => {
  // Helper to categorize status
  const getStatusCategory = (status: string) => {
    if (status === 'Finished') return 'Finished'
    if (status.includes('Lap')) return 'Lapped'
    if (['Accident', 'Collision', 'Spun off', 'Retired'].includes(status))
      return 'DNF'
    return 'Technical'
  }

  // Generate chart data from status details
  const chartData = statusDetails.details.map((detail, index) => ({
    status: detail.status,
    category: getStatusCategory(detail.status),
    count: detail.count,
    fill: `var(--chart-${(index % 12) + 1})` // Cycle through 12 chart colors
  }))

  // Generate dynamic chart config
  const chartConfig = {
    count: {
      label: 'Races'
    },
    ...statusDetails.details.reduce((acc, detail, index) => {
      acc[detail.status] = {
        label: detail.status,
        color: `var(--chart-${(index % 12) + 1})`
      }
      return acc
    }, {})
  } satisfies ChartConfig

  console.log(JSON.stringify(chartData, null, 2), 'yyy')

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Race Results</CardTitle>
        <CardDescription>Status Distribution</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px]'
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={360}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey='status' />}
            />
            <RadialBar
              dataKey='count'
              background
              minAngle={15}
              label={{
                position: 'insideStart',
                fill: '#fff'
              }}
            >
              <LabelList
                dataKey='status'
                position='insideStart'
                fill='#fff'
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='leading-none text-muted-foreground'>
          Driver race finish statistics
        </div>
      </CardFooter>
    </Card>
  )
}

// // 'use client'

// // import * as React from 'react'
// // import { TrendingUp } from 'lucide-react'
// // import { Label, Pie, PieChart } from 'recharts'

// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardFooter,
// //   CardHeader,
// //   CardTitle
// // } from '@/components/ui/card'
// // import {
// //   ChartConfig,
// //   ChartContainer,
// //   ChartTooltip,
// //   ChartTooltipContent
// // } from '@/components/ui/chart'

// // interface StatusData {
// //   status: string
// //   count: string
// //   fill?: string
// // }

// // const STATUS_COLORS = {
// //   Finished: 'var(--chart-1)',
// //   Disqualified: 'var(--chart-2)',
// //   Collision: 'var(--chart-3)',
// //   'Spun off': 'var(--chart-4)',
// //   Engine: 'var(--chart-5)',
// //   Handling: 'var(--chart-6)',
// //   '+1 Lap': 'var(--chart-7)',
// //   '+2 Laps': 'var(--chart-8)',
// //   Accident: 'var(--chart-9)',
// //   Retired: 'var(--chart-10)',
// //   Wheel: 'var(--chart-11)',
// //   Brakes: 'var(--chart-12)'
// // } as const

// // const getChartConfig = (statusData: StatusData[]) => {
// //   const config: ChartConfig = {
// //     count: { label: 'Races' }
// //   }

// //   statusData.forEach(({ status }) => {
// //     const key = status.toLowerCase().replace(/\s+/g, '')
// //     config[key] = {
// //       label: status,
// //       color: STATUS_COLORS[status] || 'var(--chart-neutral)'
// //     }
// //   })

// //   return config
// // }

// // export const DriverStatusPieChart = ({
// //   statusData,
// //   total,
// //   year
// // }: {
// //   statusData: StatusData[]
// //   total: number
// //   year: number
// // }) => {
// //   const chartConfig = React.useMemo(
// //     () => getChartConfig(statusData),
// //     [statusData]
// //   )

// //   const chartData = React.useMemo(() => {
// //     return statusData.map(({ status, count }) => ({
// //       status,
// //       count: Number(count),
// //       fill: STATUS_COLORS[status] || 'var(--chart-neutral)'
// //     }))
// //   }, [statusData])

// //   return (
// //     <Card className='flex flex-col'>
// //       <CardHeader className='items-center pb-0'>
// //         <CardTitle>Driver Race Outcomes</CardTitle>
// //         <CardDescription>{`${year} Season`}</CardDescription>
// //       </CardHeader>
// //       <CardContent className='flex-1 pb-0'>
// //         <ChartContainer
// //           config={chartConfig}
// //           className='mx-auto aspect-square max-h-[250px]'
// //         >
// //           <PieChart>
// //             <ChartTooltip
// //               cursor={false}
// //               content={<ChartTooltipContent hideLabel />}
// //             />
// //             <Pie
// //               data={chartData}
// //               dataKey='count'
// //               nameKey='status'
// //               innerRadius={60}
// //               outerRadius={90}
// //               strokeWidth={5}
// //             >
// //               <Label
// //                 content={({ viewBox }) => {
// //                   if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
// //                     return (
// //                       <text
// //                         x={viewBox.cx}
// //                         y={viewBox.cy}
// //                         textAnchor='middle'
// //                         dominantBaseline='middle'
// //                       >
// //                         <tspan
// //                           x={viewBox.cx}
// //                           y={viewBox.cy}
// //                           className='fill-foreground text-3xl font-bold'
// //                         >
// //                           {total}
// //                         </tspan>
// //                         <tspan
// //                           x={viewBox.cx}
// //                           y={(viewBox.cy || 0) + 24}
// //                           className='fill-muted-foreground'
// //                         >
// //                           Total Races
// //                         </tspan>
// //                       </text>
// //                     )
// //                   }
// //                 }}
// //               />
// //             </Pie>
// //           </PieChart>
// //         </ChartContainer>
// //       </CardContent>
// //       <CardFooter className='flex-col gap-2 text-sm'>
// //         <div className='leading-none text-muted-foreground'>
// //           {`Race finish statistics for the ${year} season`}
// //         </div>
// //       </CardFooter>
// //     </Card>
// //   )
// // }
