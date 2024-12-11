import { Equals, Star } from '@phosphor-icons/react/dist/ssr'

import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  comparison: boolean | 'tie'
  className?: string
}

export const StatCard = ({
  title,
  value,
  comparison,
  className
}: StatCardProps) => (
  <div
    className={cn(
      'relative flex flex-col border bg-card p-2 text-center text-card-foreground shadow-sm sm:p-4',
      className
    )}
  >
    {comparison === 'tie' ? (
      <Equals
        weight='bold'
        className='absolute right-2 top-2 z-50 size-3 text-blue-500'
        aria-label='Equal performance'
      />
    ) : comparison ? (
      <Star
        weight='fill'
        className='absolute right-2 top-2 z-50 size-3 text-yellow-500'
        aria-label='Better performance'
      />
    ) : null}
    <div className='flex flex-col'>
      <h2 className='text-xs text-zinc-400 sm:text-sm'>{title}</h2>
      <h3 className='mt-2 font-serif text-sm tracking-tighter sm:text-lg'>
        {value}
      </h3>
    </div>
  </div>
)
