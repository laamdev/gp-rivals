'use client'

import { FlagCheckered } from '@phosphor-icons/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'

interface RaceStatCardProps {
  label: string
  isBest?: boolean
  color?: string
  secondaryColor?: string
  value: string | number
  delta?: string | number
  className?: string
}

export const RaceStatCard = ({
  label,
  isBest,
  color,
  value,
  delta,
  className
}: RaceStatCardProps) => {
  return (
    <Card className={cn('relative', className)} style={{ borderColor: color }}>
      {isBest && (
        <FlagCheckered
          weight='fill'
          style={{ color: color }}
          className='absolute right-2.5 top-2.5 size-4 text-muted-foreground'
        />
      )}
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='font-mono text-xs font-medium tracking-wider text-zinc-300'>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-5xl font-bold'>{value}</div>
        {delta !== undefined && (
          <p className='text-xs text-muted-foreground'>
            {typeof delta === 'number' && delta > 0 ? `+${delta}` : `${delta}`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
