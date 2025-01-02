'use client'

import { Bar, BarChart, ReferenceLine, Cell, LabelList } from 'recharts'
import { ChartLineUp, ChartLineDown } from '@phosphor-icons/react'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

import { cn, isLightColor } from '@/lib/utils'

const chartConfig = {
  difference: {
    label: 'difference'
  }
} satisfies ChartConfig

export const PlacesGainBar = ({
  positionChanges,
  totalPositionsGained,
  driver,
  season,
  color
}) => {
  const chartData = positionChanges.map(position => ({
    race: position.race,
    flag: position.flag,
    grid: position.grid,
    finish: position.finish,
    difference:
      position.placesGained === 0
        ? String(position.placesGained)
        : parseInt(position.placesGained)
  }))

  return (
    <Card className=''>
      <div
        className={cn(
          'rounded-t-xl p-4 text-center font-serif text-base sm:p-6 sm:text-lg',
          isLightColor(color) ? 'text-zinc-900' : 'text-white'
        )}
        style={{ background: color }}
      >
        {driver.code}
      </div>

      <CardContent className='py-12'>
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <ReferenceLine y={0} stroke='#ffffff' strokeDasharray='3 3' />
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
              <LabelList
                position='top'
                dataKey='flag'
                fillOpacity={1}
                fontSize={20}
              />
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
        <CardFooter className='mt-8 flex-col items-center gap-2 text-sm'>
          <div className='flex items-baseline gap-x-1 font-medium leading-none'>
            <span className={cn('font-bold')} style={{ color: color }}>
              {`${driver.code} `}
            </span>
            {`${totalPositionsGained >= 0 ? 'gained' : 'lost'} `}
            <span
              className='font-bold'
              style={{
                color:
                  totalPositionsGained > 0
                    ? '#16a34a'
                    : totalPositionsGained < 0
                      ? '#dc2626'
                      : '#2563eb'
              }}
            >
              {`${totalPositionsGained >= 0 ? '+' : '-'}${Math.abs(totalPositionsGained)}`}
            </span>

            {` places in the ${season} season races.`}
            {totalPositionsGained > 0 ? (
              <ChartLineUp className='size-4' />
            ) : (
              <ChartLineDown className='size-4' />
            )}
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
