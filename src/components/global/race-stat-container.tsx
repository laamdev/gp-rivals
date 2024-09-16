import { ReactNode } from 'react'
import { CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'

interface RaceStatContainerProps {
  label: string
  children: ReactNode
  className?: string
}

export const RaceStatContainer = ({
  label,
  children,
  className
}: RaceStatContainerProps) => {
  return (
    <div>
      <CardTitle className='text-center'>{label}</CardTitle>

      <div className={cn('mt-5 grid grid-cols-2 gap-x-5 gap-y-5', className)}>
        {children}
      </div>
    </div>
  )
}
