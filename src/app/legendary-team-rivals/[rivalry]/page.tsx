import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { NavLink } from '@/components/navigation/nav-link'
import { RaceStatCard } from '@/components/global/race-stat-card'

import { getHistoricalRivalry } from '@/lib/fetchers'
import { cn } from '@/lib/utils'
import { SeasonsNav } from '@/components/legendary-team-rivals/seasons-nav'

interface TeamRivalryPageProps {
  params: {
    rivalry: string
  }
}

export default async function TeamRivalryPage({
  params
}: TeamRivalryPageProps) {
  const { rivalry } = params
  const data = await getHistoricalRivalry({ rivalry })

  if (!data) {
    return null
  }

  const driverStats = data.drivers.map(driver => {
    const seasons = data.driversSeasons.filter(ds => ds.driverId === driver.id)
    const totalPoints = seasons.reduce((sum, season) => sum + season.points, 0)
    const averagePosition =
      seasons.reduce((sum, season) => sum + season.position, 0) / seasons.length
    const championships = seasons.filter(season => season.position === 1).length
    const totalPodiums = seasons.reduce(
      (sum, season) => sum + season.podiums,
      0
    )
    const totalFastestLaps = seasons.reduce(
      (sum, season) => sum + season.fastestLaps,
      0
    )
    const totalPoles = seasons.reduce((sum, season) => sum + season.poles, 0)

    const totalWins = seasons.reduce((sum, season) => sum + season.wins, 0)

    return {
      driver,
      totalPoints,
      totalWins,
      averagePosition,
      championships,
      totalPodiums,
      totalFastestLaps,
      totalPoles
    }
  })

  const bestStats = {
    totalPoints: Math.max(...driverStats.map(ds => ds.totalPoints)),
    totalWins: Math.max(...driverStats.map(ds => ds.totalWins)),
    averagePosition: Math.min(...driverStats.map(ds => ds.averagePosition)),
    championships: Math.max(...driverStats.map(ds => ds.championships)),
    totalPodiums: Math.max(...driverStats.map(ds => ds.totalPodiums)),
    totalFastestLaps: Math.max(...driverStats.map(ds => ds.totalFastestLaps)),
    totalPoles: Math.max(...driverStats.map(ds => ds.totalPoles))
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
          <h2 className='font-mono text-sm font-medium uppercase tracking-wider text-zinc-100'>{`${data.team.name} •︎ ${data.teamSeasons.length} ${data.teamSeasons.length <= 1 ? 'Season' : 'Seasons'}`}</h2>
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
          {driverStats.map(
            ({
              driver,
              totalPoints,
              averagePosition,
              championships,
              totalPodiums,
              totalFastestLaps,
              totalPoles,
              totalWins
            }) => (
              <div key={driver.id}>
                <h3 className='mt-5 text-center text-lg font-medium uppercase tracking-wider text-zinc-100'>{`${driver.firstName} ${driver.lastName}`}</h3>
                <div className='mt-2.5 grid grid-cols-3 gap-5'>
                  <RaceStatCard
                    label='Championships'
                    value={championships}
                    isBest={championships === bestStats.championships}
                    color={data.team.primaryColor}
                  />
                  <RaceStatCard
                    label='Average Position'
                    value={averagePosition.toFixed(2)}
                    isBest={averagePosition === bestStats.averagePosition}
                    color={data.team.primaryColor}
                  />
                  <RaceStatCard
                    label='Total Points'
                    value={totalPoints}
                    isBest={totalPoints === bestStats.totalPoints}
                    color={data.team.primaryColor}
                  />
                  <RaceStatCard
                    label='Total Wins'
                    value={totalWins}
                    isBest={totalWins === bestStats.totalWins}
                    color={data.team.primaryColor}
                  />
                  <RaceStatCard
                    label='Total Poles'
                    value={totalPoles}
                    isBest={totalPoles === bestStats.totalPoles}
                    color={data.team.primaryColor}
                  />
                  <RaceStatCard
                    label='Total Podiums'
                    value={totalPodiums}
                    isBest={totalPodiums === bestStats.totalPodiums}
                    color={data.team.primaryColor}
                  />
                  <RaceStatCard
                    label='Total Fastest Laps'
                    value={totalFastestLaps}
                    isBest={totalFastestLaps === bestStats.totalFastestLaps}
                    color={data.team.primaryColor}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </MaxWidthWrapper>
  )
}
