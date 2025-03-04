import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { DriverStats } from '@/components/global/driver-stats'
import { HeadToHeadRadial } from '@/components/charts/head-to-head-radial'
import { OverallPerformanceRadar } from '@/components/charts/overall-performance-radar'
import { SectionHeading } from '@/components/global/section-heading'
import { GPStats } from '@/components/global/gp-stats'
// // import { PlacesGainBar } from '@/components/charts/places-gained-bar'

import { getDriversSeasonStats } from '@/api/queries'
import { seasons } from '@/data/seasons'

interface TeamSeasonPageProps {
  params: Promise<{
    seasonSlug: string
    teamSlug: string
  }>
  searchParams: {
    gp?: string
  }
}

interface RaceResult {
  position: string
  grid: string
  points: string
  laps: string
  status: string
  Time?: {
    time: string
  }
  FastestLap?: {
    rank: string
    Time: {
      time: string
    }
  }
}

interface Race {
  Circuit: {
    circuitId: string
  }
  raceName: string
  Results: RaceResult[]
}

interface GPStats {
  raceName: string
  driverOne: {
    position: string | null
    grid: string | null
    points: string | null
    laps: string | null
    status: string
    finishTime?: string | null
    fastestLap?: string | null
    fastestLapRank?: string | null
  }
  driverTwo: {
    position: string | null
    grid: string | null
    points: string | null
    laps: string | null
    status: string
    finishTime?: string | null
    fastestLap?: string | null
    fastestLapRank?: string | null
  }
}

const findTeam = (seasonSlug: string, teamSlug: string) => {
  const season = seasons.find(season => season.year === Number(seasonSlug))
  if (!season) {
    console.error('Season not found:', seasonSlug)
    throw new Error(`Season ${seasonSlug} not found`)
  }
  const team = season.teams.find(team => team.slug === teamSlug)
  if (!team) {
    console.error('Team not found:', {
      seasonSlug,
      teamSlug,
      availableTeams: season.teams.map(t => t.slug)
    })
    throw new Error(`Team ${teamSlug} not found in season ${seasonSlug}`)
  }
  return team
}

export async function generateStaticParams() {
  const params: Array<{ seasonSlug: string; teamSlug: string }> = []
  for (const season of seasons) {
    for (const team of season.teams) {
      params.push({
        seasonSlug: season.year.toString(),
        teamSlug: team.slug
      })
    }
  }
  return params
}

export default async function TeamSeasonPage({
  params,
  searchParams
}: TeamSeasonPageProps) {
  const { seasonSlug, teamSlug } = await params
  const team = findTeam(seasonSlug, teamSlug)

  if (!team) return null

  const { gp } = await searchParams

  // Fetch drivers' season stats
  const driversStats = await getDriversSeasonStats({
    season: seasonSlug,
    driverOne: team.drivers[0].slug,
    driverTwo: team.drivers[1].slug
  })

  if (!driversStats) {
    return (
      <MaxWidthWrapper>
        <div className='p-4 text-center'>
          <p>No data available for this team in {seasonSlug} season</p>
        </div>
      </MaxWidthWrapper>
    )
  }

  // Get points from championship leader
  const bestDriverPoints = Number(driversStats.championshipLeaderPoints || 0)

  // Find selected GP stats if gp param exists
  let gpStats: GPStats | undefined
  if (gp && driversStats.driverOneResults && driversStats.driverTwoResults) {
    const selectedGP = driversStats.driverOneResults.find(
      (result: Race) => result.Circuit.circuitId === gp
    )
    const selectedGPDriverTwo = driversStats.driverTwoResults.find(
      (result: Race) => result.Circuit.circuitId === gp
    )

    if (selectedGP || selectedGPDriverTwo) {
      gpStats = {
        raceName: selectedGP?.raceName || selectedGPDriverTwo?.raceName || '',
        driverOne: selectedGP?.Results?.[0]
          ? {
              position: selectedGP.Results[0].position,
              grid: selectedGP.Results[0].grid,
              points: selectedGP.Results[0].points,
              laps: selectedGP.Results[0].laps,
              status: selectedGP.Results[0].status,
              finishTime: selectedGP.Results[0].Time?.time,
              fastestLap: selectedGP.Results[0].FastestLap?.Time?.time,
              fastestLapRank: selectedGP.Results[0].FastestLap?.rank
            }
          : {
              position: null,
              grid: null,
              points: null,
              laps: null,
              status: 'DNS',
              finishTime: null,
              fastestLap: null,
              fastestLapRank: null
            },
        driverTwo: selectedGPDriverTwo?.Results?.[0]
          ? {
              position: selectedGPDriverTwo.Results[0].position,
              grid: selectedGPDriverTwo.Results[0].grid,
              points: selectedGPDriverTwo.Results[0].points,
              laps: selectedGPDriverTwo.Results[0].laps,
              status: selectedGPDriverTwo.Results[0].status,
              finishTime: selectedGPDriverTwo.Results[0].Time?.time,
              fastestLap: selectedGPDriverTwo.Results[0].FastestLap?.Time?.time,
              fastestLapRank: selectedGPDriverTwo.Results[0].FastestLap?.rank
            }
          : {
              position: null,
              grid: null,
              points: null,
              laps: null,
              status: 'DNS',
              finishTime: null,
              fastestLap: null,
              fastestLapRank: null
            }
      }
    }
  }

  return (
    <MaxWidthWrapper>
      <section className='mt-6 grid sm:mt-8'>
        <DriversHeader
          team={team}
          season={seasonSlug}
          raceName={gpStats?.raceName}
        />
        <SeasonRacesNav
          seasonSlug={seasonSlug}
          teamSlug={teamSlug}
          currentGP={gp}
          races={driversStats.driverOneResults}
        />
      </section>

      <div className='mt-10 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16'>
        {gp ? (
          <div>
            <SectionHeading>
              {`${seasonSlug} ${gpStats?.raceName} Stats`}
            </SectionHeading>
            <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
              <DriverStats
                driverNumber={1}
                result={
                  gpStats || {
                    raceName: '',
                    driverOne: {
                      position: null,
                      grid: null,
                      points: null,
                      laps: null,
                      status: 'DNS',
                      finishTime: null,
                      fastestLap: null,
                      fastestLapRank: null
                    },
                    driverTwo: {
                      position: null,
                      grid: null,
                      points: null,
                      laps: null,
                      status: 'DNS',
                      finishTime: null,
                      fastestLap: null,
                      fastestLapRank: null
                    }
                  }
                }
                color={team.primaryColor}
                driver={team.drivers[0].code}
                mode='race'
              />
              <DriverStats
                driverNumber={2}
                result={
                  gpStats || {
                    raceName: '',
                    driverOne: {
                      position: null,
                      grid: null,
                      points: null,
                      laps: null,
                      status: 'DNS',
                      finishTime: null,
                      fastestLap: null,
                      fastestLapRank: null
                    },
                    driverTwo: {
                      position: null,
                      grid: null,
                      points: null,
                      laps: null,
                      status: 'DNS',
                      finishTime: null,
                      fastestLap: null,
                      fastestLapRank: null
                    }
                  }
                }
                color={team.secondaryColor}
                driver={team.drivers[1].code}
                mode='race'
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              <SectionHeading>Head to Head</SectionHeading>
              <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
                <HeadToHeadRadial
                  driverOne={team.drivers[0].code}
                  driverTwo={team.drivers[1].code}
                  primaryColor={team.primaryColor}
                  secondaryColor={team.secondaryColor}
                  year={Number(seasonSlug)}
                  team={team.name}
                  competition='Race'
                  totalRaces={driversStats.driverOneTotalRaces}
                  driverOneValue={driversStats.driverOneBetterFinishes}
                  driverTwoValue={driversStats.driverTwoBetterFinishes}
                />
                <HeadToHeadRadial
                  driverOne={team.drivers[0].code}
                  driverTwo={team.drivers[1].code}
                  primaryColor={team.primaryColor}
                  secondaryColor={team.secondaryColor}
                  year={Number(seasonSlug)}
                  team={team.name}
                  competition='Qualifying'
                  totalRaces={driversStats.driverOneTotalRaces}
                  driverOneValue={driversStats.driverOneBetterGrid}
                  driverTwoValue={driversStats.driverTwoBetterGrid}
                />
              </div>
            </div>

            <div>
              <SectionHeading>Overall Performance</SectionHeading>
              <div className='mt-8'>
                <OverallPerformanceRadar
                  bestDriverPoints={bestDriverPoints}
                  driverOnePoints={Number(driversStats.driverOnePoints)}
                  driverTwoPoints={Number(driversStats.driverTwoPoints)}
                  primaryColor={team.primaryColor}
                  secondaryColor={team.secondaryColor}
                  driverOne={team.drivers[0].code}
                  driverTwo={team.drivers[1].code}
                  driverOneRaceAverage={driversStats.driverOneRaceAverage}
                  driverTwoRaceAverage={driversStats.driverTwoRaceAverage}
                  driverOneGridAverage={driversStats.driverOneGridAverage}
                  driverTwoGridAverage={driversStats.driverTwoGridAverage}
                  driverOneCompletedLaps={driversStats.driverOneCompletedLaps}
                  driverTwoCompletedLaps={driversStats.driverTwoCompletedLaps}
                  driverOnePodiumPercentage={
                    driversStats.driverOnePodiumPercentage
                  }
                  driverTwoPodiumPercentage={
                    driversStats.driverTwoPodiumPercentage
                  }
                />
              </div>
            </div>

            {/* <div>
              <SectionHeading>Places Gained/Lost</SectionHeading>
              <div className='mt-8'>
                <PlacesGainBar
                  positionChanges={driversStats.driverOnePositionChanges}
                  totalPositionsGained={
                    driversStats.driverOneTotalPositionsGained
                  }
                  driver={team.drivers[0].code}
                  season={seasonSlug}
                  color={team.primaryColor}
                />
              </div>
            </div> */}

            <div>
              <SectionHeading>Driver Stats</SectionHeading>
              <div className='mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2'>
                <DriverStats
                  driverNumber={1}
                  result={driversStats}
                  color={team.primaryColor}
                  driver={team.drivers[0].code}
                />
                <DriverStats
                  driverNumber={2}
                  result={driversStats}
                  color={team.secondaryColor}
                  driver={team.drivers[1].code}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </MaxWidthWrapper>
  )
}
