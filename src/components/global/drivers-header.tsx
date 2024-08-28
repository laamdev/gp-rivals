import { cn } from '@/lib/utils'
import Image from 'next/image'

export const DriversHeader = ({ teamMembership, drivers }) => {
  return (
    <section
      className='flex items-center justify-between rounded-t-2xl'
      style={{
        background: `linear-gradient(to bottom, ${teamMembership[0]?.team.color}, transparent)`
      }}
    >
      <Image
        src={drivers[0]?.image ?? ''}
        alt={drivers[0]?.name ?? ''}
        width={560}
        height={560}
        className={cn(
          'grouxp-hover:scale-x-105 w-24 transform duration-300 group-hover:-scale-y-105 md:w-72'
        )}
      />
      <div>
        <h1 className='text-center font-serif text-sm md:text-5xl'>{`${drivers[0]?.name ?? ''} vs ${drivers[1]?.name ?? ''}`}</h1>
      </div>
      <Image
        src={drivers[1]?.image ?? ''}
        alt={drivers[1]?.name ?? ''}
        width={560}
        height={560}
        className={cn(
          'w-24 rotate-180 -scale-y-100 transform duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
        )}
      />
    </section>
  )
}
