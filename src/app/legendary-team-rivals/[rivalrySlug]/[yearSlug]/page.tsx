import Image from 'next/image'

import { MaxWidthWrapper } from '@/components/global/max-width-wrapper'
import { DriverStatusPieChart } from '@/components/charts/driver-status-pie-chart'
import { SeasonsNav } from '@/components/legendary-team-rivals/seasons-nav'

import { cn, getTotalCounts } from '@/lib/utils'
import { legendaryTeamRivals } from '@/data/legendary-team-rivals'

interface TeamRivalrySeasonPageProps {
  params: Promise<{
    rivalrySlug: string
    yearSlug: string
  }>
}

export default async function TeamRivalrySeasonPage({
  params
}: TeamRivalrySeasonPageProps) {
  const { rivalrySlug, yearSlug } = await params

  const rivalry = await legendaryTeamRivals.find(
    ({ slug }) => slug === rivalrySlug
  )

  if (!rivalry) {
    return null
  }

  const rivalrySeason = await rivalry.seasons.find(
    ({ year }) => year === Number(yearSlug)
  )

  if (!rivalrySeason) {
    return null
  }

  const teammates = rivalrySlug.split('-vs-')
  const teammateOne = teammates[0]
  const teammateTwo = teammates[1]

  const teammateOneStatusResponse = await fetch(
    `http://ergast.com/api/f1/${rivalrySeason.year}/drivers/${teammateOne}/status.json`
  )

  if (!teammateOneStatusResponse.ok) return undefined

  const { MRData: teammateOneStatusData } =
    await teammateOneStatusResponse.json()

  const teammateTwoStatusResponse = await fetch(
    `http://ergast.com/api/f1/${rivalrySeason.year}/drivers/${teammateTwo}/status.json`
  )

  if (!teammateTwoStatusResponse.ok) return undefined

  const { MRData: teammateTwoStatusData } =
    await teammateTwoStatusResponse.json()

  const teammateOneStatus = teammateOneStatusData.StatusTable.Status
  const teammateTwoStatus = teammateTwoStatusData.StatusTable.Status

  const teammateOneTotal = getTotalCounts(teammateOneStatus)
  const teammateTwoTotal = getTotalCounts(teammateTwoStatus)

  const driverOneRaceResultResponse = await fetch(
    `http://ergast.com/api/f1/${rivalrySeason.year}/drivers/${teammateOne}/results.json`
  )

  if (!driverOneRaceResultResponse.ok) return undefined

  const { MRData: driverOneRaceResultsData } =
    await driverOneRaceResultResponse.json()

  console.log(JSON.stringify(driverOneRaceResultsData, null, 2), 'YYY')

  return (
    <MaxWidthWrapper>
      <section
        className='flex items-center justify-between rounded-t-2xl px-6 pb-24 pt-6'
        style={{
          background: `linear-gradient(to bottom, ${rivalry.primaryColor}, transparent)`
        }}
      >
        <Image
          src={rivalry.drivers[0].pictureUrl}
          alt={`${rivalry.drivers[0].firstName} ${rivalry.drivers[0].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 transform rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />

        <div className='flex flex-col items-center'>
          <h2 className='font-mono text-sm font-medium uppercase tracking-wider text-zinc-100'>{`${rivalry.team} •︎ ${yearSlug}`}</h2>
          <h1 className='mt-2.5 text-center font-serif text-sm md:text-5xl'>{`${rivalry.drivers[0].lastName ?? ''} vs ${rivalry.drivers[1].lastName ?? ''}`}</h1>
        </div>

        <Image
          src={rivalry.drivers[1].pictureUrl}
          alt={`${rivalry.drivers[1].firstName} ${rivalry.drivers[1].lastName}`}
          width={560}
          height={560}
          className={cn(
            'w-24 rounded-lg duration-300 group-hover:-scale-y-105 group-hover:scale-x-105 md:w-72'
          )}
        />
      </section>

      <SeasonsNav rivalry={rivalry} />

      <section className='mt-5 grid grid-cols-2 gap-6'>
        <DriverStatusPieChart
          statusData={teammateOneStatus}
          total={teammateOneTotal}
          year={Number(yearSlug)}
        />
        <DriverStatusPieChart
          statusData={teammateTwoStatus}
          total={teammateTwoTotal}
          year={Number(yearSlug)}
        />
      </section>

      {/* <section className='mt-5'>
        <DriverStatusPieChart
          teammateOneStatus={teammateOneStatus}
          teammateTwoStatus={teammateTwoStatus}
          year={Number(yearSlug)}
          teammateOne={rivalry.drivers[1].lastName}
          teammateTwo={rivalry.drivers[0].lastName}
        />
      </section> */}

      {/* <section className='mt-5'>
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
      </section> */}
    </MaxWidthWrapper>
  )
}
