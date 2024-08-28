import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { RaceStatCard } from '@/components/global/race-stat-card'

import { getHistoricalRivalrySeason } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import { SeasonsNav } from '@/components/legendary-team-rivals/seasons-nav'

interface TeamRivalrySeasonPageProps {
  params: {
    rivalry: string
    year: string
  }
}

export default async function TeamRivalrySeasonPage({
  params
}: TeamRivalrySeasonPageProps) {
  const { rivalry, year } = params

  const data = await getHistoricalRivalrySeason({ rivalry, year })

  if (!data) {
    return null
  }

  return (
    <MaxWidthWrapper>
      <section
        className='flex items-center justify-between rounded-t-2xl px-6 pb-24 pt-6'
        style={{
          background: `linear-gradient(to bottom, ${data.team.primaryColor}, transparent)`
        }}
      >
        <Image
          src={data.drivers[0].pictureUrl ?? ''}
          alt={
            `${data.drivers[0].firstName} ${data.drivers[0].lastName} ` ?? ''
          }
          width={560}
          height={560}
          className={cn(
            'w-24 transform rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />

        <div className='flex flex-col items-center'>
          <h2 className='font-mono text-sm font-medium uppercase tracking-wider text-zinc-100'>{`${data.team.name} •︎ ${year}`}</h2>
          <h1 className='mt-2.5 text-center font-serif text-sm md:text-5xl'>{`${data.drivers[0].lastName ?? ''} vs ${data.drivers[1].lastName ?? ''}`}</h1>
        </div>

        <Image
          src={data.drivers[1].pictureUrl ?? ''}
          alt={
            `${data.drivers[1].firstName} ${data.drivers[1].lastName} ` ?? ''
          }
          width={560}
          height={560}
          className={cn(
            'w-24 rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />
      </section>

      <SeasonsNav rivalry={rivalry} />

      <section className='mt-5'>
        <div className='grid grid-cols-2 gap-x-20'>
          {data.teamSeasons[0].driversSeasons.map(driversSeason => (
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
          ))}
        </div>
      </section>
    </MaxWidthWrapper>
  )
}
