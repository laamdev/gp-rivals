import Image from 'next/image'
import { cn } from '@/lib/utils'

export const DriversHeader = ({ team }) => {
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
      <div>
        <h1 className='text-center font-serif text-base sm:text-5xl'>{`${team.drivers[0]?.lastName} vs ${team.drivers[1]?.lastName}`}</h1>
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
