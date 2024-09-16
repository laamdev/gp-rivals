'use client'

import { FlagCheckered } from '@phosphor-icons/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { cn } from '@/lib/utils'

interface RaceStatCardProps {
  label: string
  labelTeammateA: string
  labelTeammateB: string
  valueTeammateA: string
  valueTeammateB: string
  className?: string
  color?: string
  secondaryColor?: string
}

export const H2HCard = ({
  label,
  labelTeammateA,
  labelTeammateB,
  valueTeammateA,
  valueTeammateB,
  className,
  color,
  secondaryColor
}: RaceStatCardProps) => {
  return (
    <Card className={cn('relative', className)}>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='w-full text-center font-mono text-sm font-medium tracking-wider text-zinc-300'>
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className='mt-5 grid grid-cols-2 gap-x-10'>
        <div className='flex flex-col items-center'>
          <div className='text-5xl font-bold'>{valueTeammateA}</div>
          <div className='mt-1 text-sm uppercase' style={{ color: color }}>
            {labelTeammateA}
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <div className='text-5xl font-bold'>{valueTeammateB}</div>
          <div
            className='mt-1 text-sm uppercase'
            style={{ color: secondaryColor }}
          >
            {labelTeammateB}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
