import { CompareRadarChart } from '@/components/charts/compare-radar-chart'
import { PointsPercentageRadial } from '@/components/charts/points-percentage-radial'
import { SeasonPointsArea } from '@/components/charts/season-points-area'
import { InfoCard } from '@/components/global/info-card'
import { InfoContainer } from '@/components/global/info-container'
import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { NavBadge } from '@/components/navigation/nav-badge'
import { getSeason, getSeasonRaces, getTeamMembership } from '@/lib/fetchers'
import { calculatePoints, cn } from '@/lib/utils'
import Image from 'next/image'
import type { Metadata, ResolvingMetadata } from 'next'
import { PointsPercentagePie } from '@/components/charts/points-percentage-pie'

interface TeamSeasonPageProps {
  params: {
    seasonSlug: string
    teamSlug: string
  }
}

export default async function TeamSeasonPage({ params }: TeamSeasonPageProps) {
  const { seasonSlug, teamSlug } = params
  const races = await getSeasonRaces({ year: Number(seasonSlug) })
  const teamMembership = await getTeamMembership({
    teamName: teamSlug,
    year: seasonSlug
  })

  if (!teamMembership || !races) {
    return null
  }

  const drivers = teamMembership.drivers.map(driver => {
    let totalPosition = 0
    let totalPolePosition = 0
    let totalSprintShootout = 0
    let totalSprint = 0
    let totalTimeInRace = 0
    let totalFastestLap = 0
    let totalResults = driver.raceResults.length
    let totalPoints = 0

    driver.raceResults.forEach(result => {
      totalPosition += result.position
      totalPolePosition += result.polePosition
      totalSprintShootout += result.sprintShootout ?? 0
      totalSprint += result.sprint ?? 0
      totalTimeInRace += result.timeInRace
      totalFastestLap += result.fastestLap
      // totalPoints += calculatePoints(result.position, result.raceType, result.raceCompletionPercentage);
      totalPoints += calculatePoints(result.position)
    })

    let averagePosition = totalPosition / totalResults
    let averagePolePosition = totalPolePosition / totalResults
    let averageSprintShootout = totalSprintShootout / totalResults
    let averageSprint = totalSprint / totalResults
    let averageTimeInRace = totalTimeInRace / totalResults
    let averageFastestLap = totalFastestLap / totalResults

    return {
      name: driver.driver.lastName,
      image: driver.driver.pictureUrl,
      driverId: driver.id,
      averagePosition,
      averagePolePosition,
      averageSprintShootout,
      averageSprint,
      averageTimeInRace,
      averageFastestLap,
      totalPoints
    }
  })

  return (
    <MaxWidthWrapper>
      <section className='mt-8 grid'>
        {/* <PointsPercentageRadial
          teamName={teamMembership.name}
          teammateAPoints={drivers[0].totalPoints}
          teammateBPoints={drivers[1].totalPoints}
          teammateAName={drivers[0].name}
          teammateBName={drivers[1].name}
          year={year}
          color={teamMembership.color}
        /> */}

        <PointsPercentagePie
          teamName={teamMembership.name}
          teammateAPoints={drivers[0].totalPoints}
          teammateBPoints={drivers[1].totalPoints}
          teammateAName={drivers[0].name}
          teammateBName={drivers[1].name}
          year={Number(seasonSlug)}
          color={teamMembership.color}
        />

        {/* <div>
          <h2 className='text-center text-lg font-medium'>
            Season Performance
          </h2>
          <div className='mt-4'>
            <SeasonPointsArea />
          </div>
          <InfoContainer className='mx-auto mt-4 flex h-96 w-full px-2 py-4'>
              <CompareRadarChart data={chartData} />
            </InfoContainer> 
        </div>
            */}
      </section>
    </MaxWidthWrapper>
  )
}
