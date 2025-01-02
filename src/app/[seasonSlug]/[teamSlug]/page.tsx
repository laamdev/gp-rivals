import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { DriverStats } from '@/components/global/driver-stats'
import { HeadToHeadRadial } from '@/components/charts/head-to-head-radial'
import { OverallPerformanceRadar } from '@/components/charts/overall-performance-radar'
// // import { StatusPieChart } from '@/components/charts/status-pie-chart'
import { PlacesGainBar } from '@/components/charts/places-gained-bar'
import { SectionHeading } from '@/components/global/section-heading'
import { StatCard } from '@/components/global/stat-card'

import {
  getConstructorStandings,
  getDriversSeasonStats,
  getSeasonChampion,
  getSeasonRaces
} from '@/api/queries'
import { formatPosition } from '@/lib/utils'
import { seasons } from '@/data/seasons'

interface TeamSeasonPageProps {
  params: Promise<{
    seasonSlug: string
    teamSlug: string
  }>
}

export async function generateStaticParams() {
  const teams = await seasons.find(season => season.year === 2024)?.teams

  return teams?.map(team => ({
    slug: team.slug
  }))
}

export default async function TeamSeasonPage({ params }: TeamSeasonPageProps) {
  const { seasonSlug, teamSlug } = await params

  const team = await (async () => {
    const season = seasons.find(season => season.year === Number(seasonSlug))
    if (!season) {
      throw new Error(`Season ${seasonSlug} not found`)
    }

    const team = season.teams.find(team => team.slug === teamSlug)
    if (!team) {
      throw new Error(`Team ${teamSlug} not found in season ${seasonSlug}`)
    }

    return team
  })()

  if (!team) {
    return null
  }

  const [teamOverallStats, racesResult, champion, result] = await Promise.all([
    getConstructorStandings({
      season: seasonSlug,
      constructorId: teamSlug
    }),
    getSeasonRaces({ seasonSlug }),
    getSeasonChampion(seasonSlug),
    getDriversSeasonStats({
      season: seasonSlug,
      driverOne: team.drivers[0].slug,
      driverTwo: team.drivers[1].slug
    })
  ])

  if (!teamOverallStats || !racesResult || !champion || !result) {
    return <div>No data available</div>
  }

  const { seasonRaces } = racesResult

  return (
    <MaxWidthWrapper>
      <section className='mt-6 grid sm:mt-8'>
        <DriversHeader team={team} season={seasonSlug} />
        <SeasonRacesNav
          seasonRaces={seasonRaces}
          teamSlug={teamSlug}
          seasonSlug={seasonSlug}
        />
      </section>

      <div className='mt-10 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16'>
        <div>
          <SectionHeading>{`${seasonSlug} ${team.name} Season Stats`}</SectionHeading>

          <div className='mt-6 grid grid-cols-3 sm:mt-8'>
            <StatCard
              title='Position'
              value={formatPosition(teamOverallStats.position)}
              comparison={false}
              className='rounded-bl-xl rounded-tl-xl'
            />
            <StatCard
              title='Points'
              value={teamOverallStats.points}
              comparison={false}
            />
            <StatCard
              title='Wins'
              value={teamOverallStats.wins}
              comparison={false}
              className='rounded-br-xl rounded-tr-xl'
            />
          </div>
        </div>

        <div>
          <SectionHeading>{`${seasonSlug} Drivers Season Stats`}</SectionHeading>

          <div className='mt-6 sm:mt-8'>
            <OverallPerformanceRadar
              bestDriverPoints={champion.points}
              driverOnePoints={result.driverOnePoints}
              driverTwoPoints={result.driverTwoPoints}
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              driverOne={team.drivers[0].lastName}
              driverTwo={team.drivers[1].lastName}
              driverOneRaceAverage={result.driverOneRaceAverage}
              driverTwoRaceAverage={result.driverTwoRaceAverage}
              driverOneGridAverage={result.driverOneGridAverage}
              driverTwoGridAverage={result.driverTwoGridAverage}
              driverOneCompletedLaps={result.driverOneCompletedLaps}
              driverTwoCompletedLaps={result.driverTwoCompletedLaps}
              driverOnePodiumPercentage={result.driverOnePodiumPercentage}
              driverTwoPodiumPercentage={result.driverTwoPodiumPercentage}
            />
          </div>
          <div className='mt-6 grid grid-cols-2 gap-x-6 sm:mt-8 sm:gap-x-8'>
            <DriverStats
              driverNumber={1}
              result={result}
              color={team.primaryColor}
              driver={team.drivers[0].code}
              mode='season'
            />
            <DriverStats
              driverNumber={2}
              result={result}
              color={team.secondaryColor}
              driver={team.drivers[1].code}
              mode='season'
            />
          </div>
        </div>

        <div>
          <SectionHeading>{`${seasonSlug} Head-to-Heads`}</SectionHeading>

          <div className='mt-6 grid gap-6 sm:mt-8 sm:grid-cols-2 sm:gap-8'>
            <HeadToHeadRadial
              competition='race'
              year={seasonSlug}
              team={team.name}
              driverOne={team.drivers[0].lastName}
              driverTwo={team.drivers[1].lastName}
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              totalRaces={seasonRaces.length}
              driverOneValue={result.driverOneBetterFinishes}
              driverTwoValue={result.driverTwoBetterFinishes}
            />
            <HeadToHeadRadial
              competition='grid'
              year={seasonSlug}
              team={team.name}
              driverOne={team.drivers[0].lastName}
              driverTwo={team.drivers[1].lastName}
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              totalRaces={seasonRaces.length}
              driverOneValue={result.driverOneBetterGrid}
              driverTwoValue={result.driverTwoBetterGrid}
            />
          </div>
        </div>

        <div>
          <SectionHeading>{`${seasonSlug} Places Gained / Lost`}</SectionHeading>
          <div className='grid grid-cols-2 gap-6 sm:mt-8 sm:gap-8'>
            <PlacesGainBar
              positionChanges={result.driverOnePositionChanges}
              totalPositionsGained={result.driverOneTotalPositionsGained}
              driver={team.drivers[0]}
              color={team.primaryColor}
              season={seasonSlug}
            />
            <PlacesGainBar
              positionChanges={result.driverTwoPositionChanges}
              totalPositionsGained={result.driverTwoTotalPositionsGained}
              driver={team.drivers[1]}
              color={team.secondaryColor}
              season={seasonSlug}
            />
          </div>
        </div>

        {/* <div>
          <SectionHeading>{`${seasonSlug} Other Stats`}</SectionHeading>

          <div className='mt-6 grid grid-cols-2 gap-6 sm:mt-8 sm:gap-8'>
            <StatusPieChart status={result.driverOneStatus} />
            <StatusPieChart status={result.driverTwoStatus} />
          </div>
        </div> */}
      </div>
    </MaxWidthWrapper>
  )
}
