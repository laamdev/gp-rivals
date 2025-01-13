import { Suspense } from 'react'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriversHeader } from '@/components/global/drivers-header'
import { SeasonRacesNav } from '@/components/global/season-races-nav'
import { DriverStats } from '@/components/global/driver-stats'
import { HeadToHeadRadial } from '@/components/charts/head-to-head-radial'
import { OverallPerformanceRadar } from '@/components/charts/overall-performance-radar'
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

// Create a loading component
function Loading() {
  return (
    <div className='p-4 text-center'>
      <p>Loading team data...</p>
    </div>
  )
}

interface TeamStatsProps {
  team: any
  seasonSlug: string
  teamSlug: string
}

// Separate component for race navigation
async function RaceNavigation({ seasonSlug, teamSlug }) {
  const racesResult = await getSeasonRaces(seasonSlug)
  if (!racesResult) return null

  return (
    <SeasonRacesNav
      seasonRaces={racesResult.seasonRaces}
      teamSlug={teamSlug}
      seasonSlug={seasonSlug}
    />
  )
}

async function TeamStats({ team, seasonSlug, teamSlug }: TeamStatsProps) {
  try {
    console.log('Fetching team stats for:', { seasonSlug, teamSlug, team })

    const [teamOverallStats, racesResult, champion, result] =
      await Promise.allSettled([
        getConstructorStandings({
          season: seasonSlug,
          constructorId: teamSlug
        }),
        getSeasonRaces(seasonSlug),
        getSeasonChampion(seasonSlug),
        getDriversSeasonStats({
          season: seasonSlug,
          driverOne: team.drivers[0].slug,
          driverTwo: team.drivers[1].slug
        })
      ])

    // Log the results of each promise
    console.log('API Results:', {
      teamOverallStats: teamOverallStats.status,
      racesResult: racesResult.status,
      champion: champion.status,
      driverStats: result.status
    })

    // Check if any promises were rejected
    if (teamOverallStats.status === 'rejected') {
      console.error('Team stats fetch failed:', teamOverallStats.reason)
      return (
        <div className='p-4 text-center'>
          <p>Error loading team standings</p>
          <p className='mt-2 text-sm text-gray-500'>Please try again later</p>
        </div>
      )
    }

    if (racesResult.status === 'rejected') {
      console.error('Races fetch failed:', racesResult.reason)
      return (
        <div className='p-4 text-center'>
          <p>Error loading race data</p>
          <p className='mt-2 text-sm text-gray-500'>Please try again later</p>
        </div>
      )
    }

    if (champion.status === 'rejected') {
      console.error('Champion fetch failed:', champion.reason)
      return (
        <div className='p-4 text-center'>
          <p>Error loading champion data</p>
          <p className='mt-2 text-sm text-gray-500'>Please try again later</p>
        </div>
      )
    }

    if (result.status === 'rejected') {
      console.error('Driver stats fetch failed:', result.reason)
      return (
        <div className='p-4 text-center'>
          <p>Error loading driver statistics</p>
          <p className='mt-2 text-sm text-gray-500'>Please try again later</p>
        </div>
      )
    }

    // Extract the values from fulfilled promises
    const stats = teamOverallStats.value
    const races = racesResult.value
    const championData = champion.value
    const driverStats = result.value

    if (!stats || !races || !championData || !driverStats) {
      console.error('Missing data:', {
        stats,
        races,
        championData,
        driverStats
      })
      return (
        <div className='p-4 text-center'>
          <p>
            No data available for {team.name} in {seasonSlug}
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            Please try again later or contact support if the issue persists.
          </p>
        </div>
      )
    }

    const { seasonRaces } = races

    return (
      <>
        <div>
          <SectionHeading>{`${seasonSlug} ${team.name} Season Stats`}</SectionHeading>
          <div className='mt-6 grid grid-cols-3 sm:mt-8'>
            <StatCard
              title='Position'
              value={formatPosition(stats.position)}
              comparison={false}
              className='rounded-bl-xl rounded-tl-xl'
            />
            <StatCard title='Points' value={stats.points} comparison={false} />
            <StatCard
              title='Wins'
              value={stats.wins}
              comparison={false}
              className='rounded-br-xl rounded-tr-xl'
            />
          </div>
        </div>

        <div>
          <SectionHeading>{`${seasonSlug} Drivers Season Stats`}</SectionHeading>
          <div className='mt-6 sm:mt-8'>
            <OverallPerformanceRadar
              bestDriverPoints={championData.points}
              driverOnePoints={driverStats.driverOnePoints}
              driverTwoPoints={driverStats.driverTwoPoints}
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              driverOne={team.drivers[0].lastName}
              driverTwo={team.drivers[1].lastName}
              driverOneRaceAverage={driverStats.driverOneRaceAverage}
              driverTwoRaceAverage={driverStats.driverTwoRaceAverage}
              driverOneGridAverage={driverStats.driverOneGridAverage}
              driverTwoGridAverage={driverStats.driverTwoGridAverage}
              driverOneCompletedLaps={driverStats.driverOneCompletedLaps}
              driverTwoCompletedLaps={driverStats.driverTwoCompletedLaps}
              driverOnePodiumPercentage={driverStats.driverOnePodiumPercentage}
              driverTwoPodiumPercentage={driverStats.driverTwoPodiumPercentage}
            />
          </div>
          <div className='mt-6 grid grid-cols-2 gap-x-6 sm:mt-8 sm:gap-x-8'>
            <DriverStats
              driverNumber={1}
              result={driverStats}
              color={team.primaryColor}
              driver={team.drivers[0].code}
              mode='season'
            />
            <DriverStats
              driverNumber={2}
              result={driverStats}
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
              driverOneValue={driverStats.driverOneBetterFinishes}
              driverTwoValue={driverStats.driverTwoBetterFinishes}
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
              driverOneValue={driverStats.driverOneBetterGrid}
              driverTwoValue={driverStats.driverTwoBetterGrid}
            />
          </div>
        </div>

        <div>
          <SectionHeading>{`${seasonSlug} Places Gained / Lost`}</SectionHeading>
          <div className='grid grid-cols-2 gap-6 sm:mt-8 sm:gap-8'>
            <PlacesGainBar
              positionChanges={driverStats.driverOnePositionChanges}
              totalPositionsGained={driverStats.driverOneTotalPositionsGained}
              driver={team.drivers[0]}
              color={team.primaryColor}
              season={seasonSlug}
            />
            <PlacesGainBar
              positionChanges={driverStats.driverTwoPositionChanges}
              totalPositionsGained={driverStats.driverTwoTotalPositionsGained}
              driver={team.drivers[1]}
              color={team.secondaryColor}
              season={seasonSlug}
            />
          </div>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error in TeamStats:', error)
    return (
      <div className='p-4 text-center'>
        <p>Error loading team statistics</p>
        <p className='mt-2 text-sm text-gray-500'>Please try again later</p>
      </div>
    )
  }
}

// Helper function to find the team in the season
const findTeam = (seasonSlug: string, teamSlug: string) => {
  console.log('Finding team:', { seasonSlug, teamSlug })
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

export default async function TeamSeasonPage({ params }: TeamSeasonPageProps) {
  console.log('TeamSeasonPage params:', params)
  const { seasonSlug, teamSlug } = await params
  const team = findTeam(seasonSlug, teamSlug)

  if (!team) return null

  return (
    <MaxWidthWrapper>
      <section className='mt-6 grid sm:mt-8'>
        <DriversHeader team={team} season={seasonSlug} />
        <Suspense fallback={<Loading />}>
          <RaceNavigation seasonSlug={seasonSlug} teamSlug={teamSlug} />
        </Suspense>
      </section>

      <div className='mt-10 flex flex-col gap-y-10 sm:mt-16 sm:gap-y-16'>
        <Suspense fallback={<Loading />}>
          <TeamStats team={team} seasonSlug={seasonSlug} teamSlug={teamSlug} />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  )
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
