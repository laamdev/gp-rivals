'use client'

import { Bar, BarChart, CartesianGrid, Cell, LabelList } from 'recharts'
import { ChartLineUp, ChartLineDown } from '@phosphor-icons/react'

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

const chartConfig = {
  difference: {
    label: 'difference'
  }
} satisfies ChartConfig

export const PlacesGainBar = ({
  positionChanges,
  totalPositionsGained,
  driver,
  season
}) => {
  const chartData = positionChanges.map(position => ({
    race: position.race,
    grid: position.grid,
    finish: position.finish,
    difference:
      position.placesGained === 0
        ? String(position.placesGained)
        : parseInt(position.placesGained)
  }))

  console.log(JSON.stringify(chartData, null, 2), 'chartData')

  return (
    <Card>
      <CardHeader>
        <CardTitle>{`Places Gained / Lost - ${driver}`}</CardTitle>
        <CardDescription>{`${season} Season`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            {/* <CartesianGrid vertical={false} /> */}
            <ChartTooltip
              filterNull={false}
              includeHidden={true}
              cursor={false}
              content={
                <ChartTooltipContent
                  filterNull={false}
                  hideLabel
                  className='w-[180px]'
                  formatter={(value, name, props) => {
                    const item = props.payload?.[0] ?? props.payload

                    return (
                      <div className='flex w-full flex-col gap-2'>
                        <div className='border-b pb-2 text-center text-xs font-medium'>
                          {item.race}
                        </div>
                        <div className='flex flex-col gap-1.5 text-xs'>
                          <div className='flex justify-between'>
                            <span>Grid:</span>
                            <span className='font-mono'>{item.grid}</span>
                          </div>
                          <div className='flex justify-between'>
                            <span>Finish:</span>
                            <span className='font-mono'>{item.finish}</span>
                          </div>
                        </div>
                        <div className='flex justify-between border-t pt-2 text-xs font-medium'>
                          <span>Difference:</span>
                          <span className='font-mono'>{item.difference}</span>
                        </div>
                      </div>
                    )
                  }}
                />
              }
            />
            <Bar dataKey='difference'>
              <LabelList position='top' dataKey='race' fillOpacity={1} />
              {chartData.map(item => (
                <Cell
                  key={item.race}
                  fill={
                    item.difference > 0
                      ? '#16a34a'
                      : item.difference == 0
                        ? '#2563eb'
                        : '#dc2626'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
        <CardFooter className='mt-8 flex-col items-start gap-2 text-sm'>
          <div className='flex gap-2 font-medium leading-none'>
            {`${driver} ${totalPositionsGained >= 0 ? 'gained' : 'lost'} ${totalPositionsGained < 0 ? totalPositionsGained * -1 : totalPositionsGained} places in the ${season} season races.`}
            {totalPositionsGained > 0 ? (
              <ChartLineUp className='size-4' />
            ) : (
              <ChartLineDown className='size-4' />
            )}
          </div>
          <div className='leading-none text-muted-foreground'>
            {`Total places gained / lost in the ${chartData.length} races of the ${season} season.`}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
