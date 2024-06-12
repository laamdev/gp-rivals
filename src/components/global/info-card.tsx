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
      <span className='text-[10px] uppercase text-zinc-300 md:text-xs'>
        {label}
      </span>
      <p className='mt-2 text-sm font-bold tabular-nums md:text-xl'>
        {value === 0 ? '—' : value}
      </p>
    </div>
  )
}
