import Image from 'next/image'
import Link from 'next/link'

import { MainHeader } from '@/components/global/main-header'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'

import { getHistoricalRivalries } from '@/lib/fetchers'
import { cn } from '@/lib/utils'

export default async function HistoricalTeamRivalriesPage() {
  const data = await getHistoricalRivalries()

  return (
    <MaxWidthWrapper>
      <MainHeader
        heading='Legendary Team Rivals'
        summary='Explore how these legendary drivers matched up when they shared the same car, and relive the moments that defined their epic battles on the track.'
      />
      <div className='mt-16 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3'>
        {data.map(rivalry => (
          <Link
            key={rivalry.id}
            href={`/legendary-team-rivals/${rivalry.slug}`}
            className='group'
          >
            <div
              style={{
                background: `linear-gradient(to bottom, ${rivalry.team.primaryColor}, transparent)`
              }}
              className={cn(
                'mt-4 grid grid-cols-2 gap-5 rounded-lg px-4 pb-10 pt-5 md:px-6'
              )}
            >
              {rivalry.drivers.map((driver, idx) => (
                <div key={driver.id} className='relative'>
                  <div className={cn('relative overflow-hidden rounded-lg')}>
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
                  <div className='absolute inset-0 transform rounded-lg bg-black opacity-10 duration-300 group-hover:opacity-0' />
                </div>
              ))}
            </div>
            <h2 className='-mt-5 text-center font-mono text-lg'>
              {`${rivalry.drivers[0]?.lastName} vs ${rivalry.drivers[1]?.lastName}`}
            </h2>
          </Link>
        ))}
      </div>

      <section className='mt-5'>
        <div className='grid grid-cols-2 gap-x-20'>
          {/* {data.teamSeasons[0].driversSeasons.map((driversSeason, index) => (
            <div key={driversSeason.id}>
              <h3 className='mt-5 text-center text-lg font-medium uppercase tracking-wider text-zinc-100'>{`${driversSeason.driver.firstName} ${driversSeason.driver.lastName}`}</h3>
              <div className='mt-2.5 grid grid-cols-3 gap-5'>
                <RaceStatCard
                  label='Position'
                  value={driversSeason.position}
                  isBest={
                    driversSeason.position ===
                    Math.min(
                      ...data.teamSeasons[0].driversSeasons.map(
                        ds => ds.position
                      )
                    )
                  }
                  color={data.team.primaryColor}
                />
                <RaceStatCard
                  label='Points'
                  value={driversSeason.points}
                  isBest={
                    driversSeason.points ===
                    Math.max(
                      ...data.teamSeasons[0].driversSeasons.map(ds => ds.points)
                    )
                  }
                  color={data.team.primaryColor}
                />
                <RaceStatCard
                  label='Wins'
                  value={driversSeason.wins}
                  isBest={
                    driversSeason.wins ===
                    Math.max(
                      ...data.teamSeasons[0].driversSeasons.map(ds => ds.wins)
                    )
                  }
                  color={data.team.primaryColor}
                />
                <RaceStatCard
                  label='Podiums'
                  value={driversSeason.podiums}
                  isBest={
                    driversSeason.podiums ===
                    Math.max(
                      ...data.teamSeasons[0].driversSeasons.map(
                        ds => ds.podiums
                      )
                    )
                  }
                  color={data.team.primaryColor}
                />
                <RaceStatCard
                  label='Poles'
                  value={driversSeason.poles}
                  isBest={
                    driversSeason.poles ===
                    Math.max(
                      ...data.teamSeasons[0].driversSeasons.map(ds => ds.poles)
                    )
                  }
                  color={data.team.primaryColor}
                />
                <RaceStatCard
                  label='Fastest Laps'
                  value={driversSeason.fastestLaps}
                  isBest={
                    driversSeason.fastestLaps ===
                    Math.max(
                      ...data.teamSeasons[0].driversSeasons.map(
                        ds => ds.fastestLaps
                      )
                    )
                  }
                  color={data.team.primaryColor}
                />
                <RaceStatCard
                  label='Races Completed'
                  value={driversSeason.races}
                  isBest={
                    driversSeason.races ===
                    Math.max(
                      ...data.teamSeasons[0].driversSeasons.map(ds => ds.races)
                    )
                  }
                  color={data.team.primaryColor}
                />
              </div>
            </div>
          ))} */}
        </div>
      </section>
    </MaxWidthWrapper>
  )
}
