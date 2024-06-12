import { cn } from '@/lib/utils'

interface InfoCardProps {
  label: string
  value: string | number
  className?: string
}

export const InfoCard = ({ label, value, className }: InfoCardProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center self-center px-2 py-4',
        className
      )}
    >
      <span className='text-xs uppercase text-zinc-300'>{label}</span>
      <p className='mt-2 text-xl font-bold tabular-nums'>
        {value === 0 ? '—' : value}
      </p>
    </div>
  )
}
