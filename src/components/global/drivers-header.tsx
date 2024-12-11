import Image from 'next/image'

import { cn } from '@/lib/utils'

interface DriversHeaderProps {
  team: {
    name: string
    primaryColor: string
    secondaryColor: string
    drivers: {
      pictureUrl: string
      lastName: string
    }[]
  }
  season?: string
  raceName?: string
}

export const DriversHeader = ({
  team,
  season,
  raceName
}: DriversHeaderProps) => {
  return (
    <section
      className='flex items-center justify-between rounded-t-2xl'
      style={{
        background: `linear-gradient(to right, ${team.primaryColor}, ${team.secondaryColor})`,
        maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 70%, transparent 100%)'
      }}
    >
      <Image
        src={team.drivers[0].pictureUrl}
        alt={team.drivers[0].lastName}
        width={560}
        height={560}
        className={cn('w-24 rotate-180 -scale-y-100 sm:w-72')}
      />
      <div className='flex flex-col items-center sm:gap-y-2'>
        <h2 className='text-xs font-medium uppercase tracking-widest text-zinc-100 sm:text-base'>
          {team.name} · {season} {raceName ?? ''}
        </h2>
        <h1 className='text-center font-serif text-base font-bold sm:text-5xl'>{`${team.drivers[0]?.lastName} vs ${team.drivers[1]?.lastName}`}</h1>
      </div>
      <Image
        src={team.drivers[1].pictureUrl}
        alt={team.drivers[1].lastName}
        width={560}
        height={560}
        className={cn('w-24 sm:w-72')}
      />
    </section>
  )
}
