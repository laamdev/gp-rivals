import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { DriverStats } from '@/components/global/driver-stats'
import { HeadToHeadRadial } from '@/components/charts/head-to-head-radial'
import { DriverStatusRadial } from '@/components/charts/driver-status-radial'
import { OverallPerformanceRadar } from '@/components/charts/overall-performance-radar'

import {
  getDriversSeasonStats,
  getSeasonChampion,
  getSeasonRaces
} from '@/lib/fetchers'
import { seasons } from '@/data/seasons'
import { StatusPieChart } from '@/components/charts/status-pie-chart'
import { resourceLimits } from 'worker_threads'
import { PlacesGainBar } from '@/components/charts/places-gained-bar'
interface TeamSeasonPageProps {
  params: Promise<{
    seasonSlug: string
    teamSlug: string
  }>
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
    return <div></div>
  }

  const racesResult = await getSeasonRaces({ seasonSlug })

  if (!racesResult) {
    return null
  }

  const { seasonRaces } = racesResult

  const champion = await getSeasonChampion(seasonSlug)

  if (!champion) {
    return null
  }

  const result = await getDriversSeasonStats({
    season: seasonSlug,
    driverOne: team.drivers[0].slug,
    driverTwo: team.drivers[1].slug
  })

  if (!result) {
    return <div>No data available</div>
  }

  return (
    <MaxWidthWrapper>
      <section className='mt-8 grid'>
        <DriversHeader team={team} />
        <SeasonRacesNav
          seasonRaces={seasonRaces}
          teamSlug={teamSlug}
          seasonSlug={seasonSlug}
        />
      </section>

      <div className='mt-16 flex flex-col gap-y-16'>
        <div>
          <h2 className='text-center text-lg font-bold'>{`${seasonSlug} Season Stats`}</h2>

          <div className='mt-8'>
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
              driverOneQualifyingAverage={result.driverOneQualifyingAverage}
              driverTwoQualifyingAverage={result.driverTwoQualifyingAverage}
            />
          </div>
          <div className='mt-8 grid grid-cols-2 gap-x-8'>
            <DriverStats driverNumber={1} result={result} />
            <DriverStats driverNumber={2} result={result} />
          </div>
        </div>

        <div>
          <h2 className='text-center text-lg font-bold'>{`${seasonSlug} Head-to-Heads`}</h2>

          <div className='mt-8 grid gap-8 sm:grid-cols-2'>
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
              competition='qualifying'
              year={seasonSlug}
              team={team.name}
              driverOne={team.drivers[0].lastName}
              driverTwo={team.drivers[1].lastName}
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              totalRaces={seasonRaces.length}
              driverOneValue={result.driverOneBetterQualifying}
              driverTwoValue={result.driverTwoBetterQualifying}
            />
          </div>

          <div className='mt-8 grid grid-cols-2 gap-8'>
            <StatusPieChart status={result.driverOneStatus} />
            <StatusPieChart status={result.driverTwoStatus} />
            {/* <DriverStatusRadial statusDetails={result.driverOneStatus} />
            <DriverStatusRadial statusDetails={result.driverTwoStatus} /> */}
          </div>
        </div>

        <div className='grid gap-8'>
          <PlacesGainBar
            positionChanges={result.driverOnePositionChanges}
            totalPositionsGained={result.driverOneTotalPositionsGained}
            driver={team.drivers[0].lastName}
            season={seasonSlug}
          />
          <PlacesGainBar
            positionChanges={result.driverTwoPositionChanges}
            totalPositionsGained={result.driverTwoTotalPositionsGained}
            driver={team.drivers[1].lastName}
            season={seasonSlug}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
