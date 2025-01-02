import Link from 'next/link'
import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { MainHeader } from '@/components/global/main-header'

import { cn } from '@/lib/utils'
import { seasons } from '@/data/seasons'

export default async function HomePage() {
  const season = seasons.find(season => season.year === 2024)

  if (!season) {
    return null
  }

  return (
    <MaxWidthWrapper>
      <MainHeader />

      {/* <SeasonsNav /> */}

      <div className='mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2'>
        {season &&
          season.teams.map(team => (
            <Link href={`/2024/${team.slug}`} key={team.id} className='group'>
              <ul
                className={cn('mt-4 grid grid-cols-2 rounded-t-xl')}
                style={{
                  background: `linear-gradient(to right, ${team.primaryColor}, ${team.secondaryColor})`,
                  maskImage:
                    'linear-gradient(to bottom, black 70%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 70%, transparent 100%)'
                }}
              >
                {team.drivers.slice(0, 2).map((driver, idx) => (
                  <li key={driver.id} className='relative'>
                    <div className={cn('relative overflow-hidden')}>
                      <Image
                        alt={`${driver.firstName} ${driver.lastName}`}
                        src={driver.pictureUrl ?? ''}
                        width={320}
                        height={320}
                        className={cn(
                          'transform duration-300',
                          idx % 2 === 0
                            ? 'rotate-180 -scale-y-100 group-hover:-scale-y-105 group-hover:scale-x-105'
                            : 'group-hover:scale-105'
                        )}
                      />
                    </div>
                    <div className='absolute inset-0 transform bg-black opacity-10 duration-300 group-hover:opacity-0' />
                  </li>
                ))}
              </ul>
              <h2 className='mt-4 text-center font-serif text-sm font-medium sm:text-base'>
                {team.name}
              </h2>
            </Link>
          ))}
      </div>
    </MaxWidthWrapper>
  )
}
