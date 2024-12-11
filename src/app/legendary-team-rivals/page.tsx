import Image from 'next/image'
import Link from 'next/link'

import { MainHeader } from '@/components/global/main-header'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'

import { cn } from '@/lib/utils'
import { legendaryTeamRivals } from '@/data/legendary-team-rivals'

export default async function HistoricalTeamRivalriesPage() {
  return (
    <MaxWidthWrapper>
      <MainHeader
        heading='Legendary Team Rivals'
        summary='Explore how these legendary drivers matched up when they shared the same car, and relive the moments that defined their epic battles on the track.'
      />
      <div className='mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3'>
        {legendaryTeamRivals.map((team, idx) => (
          <Link
            key={idx}
            href={`/legendary-team-rivals/${team.slug}`}
            className='group'
          >
            <div
              style={{
                background: `linear-gradient(to right, ${team.primaryColor}, ${team.secondaryColor})`
              }}
              className={cn(
                'mt-4 grid grid-cols-2 gap-5 rounded-xl px-4 pb-10 pt-5 md:px-6'
              )}
            >
              {team.drivers.map(driver => (
                <div key={driver.id} className='relative'>
                  <div className={cn('relative overflow-hidden rounded-xl')}>
                    <Image
                      alt={`${driver.firstName} ${driver.lastName}`}
                      src={driver.pictureUrl ?? ''}
                      width={320}
                      height={320}
                      className={cn(
                        'transform duration-300 group-hover:scale-105'
                      )}
                    />
                  </div>
                  <div className='absolute inset-0 transform rounded-xl bg-black opacity-10 duration-300 group-hover:opacity-0' />
                </div>
              ))}
            </div>
            <h2 className='-mt-5 text-center font-mono text-lg'>
              {`${team.drivers[0]?.lastName} vs ${team.drivers[1]?.lastName}`}
            </h2>
          </Link>
        ))}
      </div>
    </MaxWidthWrapper>
  )
}
