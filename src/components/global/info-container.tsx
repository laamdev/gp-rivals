import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface InfoContainerProps {
  children: ReactNode
  className?: string
}

export const InfoContainer = ({ children, className }: InfoContainerProps) => {
  return (
    <div
      className={cn('grid h-fit grid-cols-2 rounded bg-zinc-900', className)}
    >
      {children}
    </div>
  )
}
