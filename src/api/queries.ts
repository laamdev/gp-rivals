import { fetchErgastData } from '@/api'
import {
  calculateAveragePosition,
  calculateDriverStats,
  calculateRaceCompletion,
  comparePositions
} from '@/api/helpers'
import {
  DriversSeasonStats,
  DriverStats,
  ErgastResponse,
  Race,
  RaceResult
} from '@/api/types'
import { SEASON_LAPS_2024 } from '@/api/constants'

// Fetch season races data
export const getSeasonRaces = async (seasonSlug: string) => {
  const response = await fetchErgastData<ErgastResponse>(
    `/${seasonSlug}/races.json`
  )

  if (!response?.MRData?.RaceTable?.Races) return undefined

  return {
    seasonRaces: response.MRData.RaceTable.Races,
    totalSeasonRaces: response.MRData.total
  }
}

// Helper function to find driver result
const findDriverResult = (race: Race, driverId: string) =>
  race.Results?.find(r => r.Driver.driverId === driverId)

// Helper function to calculate race stats
const calculateRaceStats = (races: Race[], driverId: string) => {
  const poles = races.filter(
    race => findDriverResult(race, driverId)?.grid === '1'
  )
  const winsFromPole = poles.filter(
    race => findDriverResult(race, driverId)?.position === '1'
  )
  const podiums = races.filter(race => {
    const result = findDriverResult(race, driverId)
    return result?.position && parseInt(result.position) <= 3
  }).length
  const completedLaps = races.reduce((sum, race) => {
    const result = findDriverResult(race, driverId)
    return sum + parseInt(result?.laps || '0')
  }, 0)

  return {
    poles: poles.length,
    winsFromPole: winsFromPole.length,
    podiums,
    completedLaps,
    poleToWinRatio:
      poles.length > 0
        ? Number(((winsFromPole.length / poles.length) * 100).toFixed(2))
        : 0,
    podiumPercentage:
      races.length > 0 ? Number(((podiums / races.length) * 100).toFixed(2)) : 0
  }
}

// Fetch driver stats
const getDriverStats = async (
  seasonSlug: string,
  driverId: string
): Promise<DriverStats | undefined> => {
  try {
    const [seasonData, raceData, statusData] = await Promise.all([
      fetchErgastData<ErgastResponse>(
        `/${seasonSlug}/drivers/${driverId}/driverStandings.json`
      ),
      fetchErgastData<ErgastResponse>(
        `/${seasonSlug}/drivers/${driverId}/results.json`
      ),
      fetchErgastData<ErgastResponse>(`/${seasonSlug}/status.json`)
    ])

    if (
      !raceData?.MRData?.RaceTable?.Races ||
      !statusData?.MRData?.StatusTable?.Status ||
      !seasonData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
    ) {
      return undefined
    }

    const races = raceData.MRData.RaceTable.Races
    const raceCompletion = calculateRaceCompletion(statusData.MRData)
    const driverStandings =
      seasonData.MRData.StandingsTable.StandingsLists[0].DriverStandings
    const points = driverStandings.find(
      driver => driver.Driver.driverId === driverId
    )
    const basicStats = calculateDriverStats(raceData, points)
    const raceStats = calculateRaceStats(races, driverId)

    return {
      ...basicStats,
      ...raceStats,
      points,
      status: statusData.MRData.StatusTable.Status,
      races,
      finishedRaces: raceCompletion.finishedRaces,
      dnfRaces: raceCompletion.dnfRaces,
      fastestLaps: basicStats.fastestLaps ?? 0,
      positionChanges: basicStats.positionChanges ?? [],
      totalPositionsGained: basicStats.totalPositionsGained ?? 0,
      lapsCompleted: basicStats.lapsCompleted ?? 0,
      totalRaces: basicStats.totalRaces ?? 0,
      pointsPerRace: basicStats.pointsPerRace ?? 0,
      lapCompletionPercentage:
        SEASON_LAPS_2024 > 0
          ? Number(
              ((raceStats.completedLaps / SEASON_LAPS_2024) * 100).toFixed(2)
            )
          : 0,
      gridAverage: Number(calculateAveragePosition(races, 'gridAverage')),
      raceAverage: Number(calculateAveragePosition(races, 'raceAverage'))
    }
  } catch (error) {
    return undefined
  }
}

// Fetch stats for both drivers in a season
export const getDriversSeasonStats = async ({
  season,
  driverOne,
  driverTwo
}: {
  season: string
  driverOne: string
  driverTwo: string
}): Promise<DriversSeasonStats | undefined> => {
  const [driverOneStats, driverTwoStats] = await Promise.all([
    getDriverStats(season, driverOne),
    getDriverStats(season, driverTwo)
  ])

  if (!driverOneStats || !driverTwoStats) return undefined

  const raceComparison = comparePositions(
    driverOneStats.races,
    driverTwoStats.races,
    'race'
  )
  const gridComparison = comparePositions(
    driverOneStats.races,
    driverTwoStats.races,
    'grid'
  )

  return {
    driverOneGridAverage: driverOneStats.gridAverage,
    driverOneRaceAverage: driverOneStats.raceAverage,
    driverTwoGridAverage: driverTwoStats.gridAverage,
    driverTwoRaceAverage: driverTwoStats.raceAverage,
    driverOnePoints: driverOneStats.points?.points ?? '0',
    driverTwoPoints: driverTwoStats.points?.points ?? '0',
    driverOnePosition: driverOneStats.points?.position ?? '',
    driverTwoPosition: driverTwoStats.points?.position ?? '',
    driverOneWins: driverOneStats.points?.wins ?? '0',
    driverTwoWins: driverTwoStats.points?.wins ?? '0',
    driverOnePoles: driverOneStats.poles,
    driverTwoPoles: driverTwoStats.poles,
    driverOnePodiumPercentage: driverOneStats.podiumPercentage,
    driverTwoPodiumPercentage: driverTwoStats.podiumPercentage,
    driverOneBetterFinishes: raceComparison.driver1Better,
    driverTwoBetterFinishes: raceComparison.driver2Better,
    driverOneBetterGrid: gridComparison.driver1Better,
    driverTwoBetterGrid: gridComparison.driver2Better,
    driverOneStatus: driverOneStats.status,
    driverTwoStatus: driverTwoStats.status,
    driverOnePositionChanges: driverOneStats.positionChanges,
    driverTwoPositionChanges: driverTwoStats.positionChanges,
    driverOneTotalPositionsGained: driverOneStats.totalPositionsGained,
    driverTwoTotalPositionsGained: driverTwoStats.totalPositionsGained,
    driverOneFastestLaps: driverOneStats.fastestLaps,
    driverTwoFastestLaps: driverTwoStats.fastestLaps,
    driverOnePodiums: driverOneStats.podiums,
    driverTwoPodiums: driverTwoStats.podiums,
    driverOnePoleToWinRatio: driverOneStats.poleToWinRatio,
    driverTwoPoleToWinRatio: driverTwoStats.poleToWinRatio,
    driverOneTotalRaces: driverOneStats.totalRaces,
    driverTwoTotalRaces: driverTwoStats.totalRaces,
    driverOnePointsPerRace: driverOneStats.pointsPerRace,
    driverTwoPointsPerRace: driverTwoStats.pointsPerRace,
    driverOneCompletedLaps: driverOneStats.completedLaps,
    driverTwoCompletedLaps: driverTwoStats.completedLaps,
    driverOneLapCompletion: driverOneStats.lapCompletionPercentage,
    driverTwoLapCompletion: driverTwoStats.lapCompletionPercentage
  }
}

// Fetch driver race result
const getDriverRaceResult = async (
  season: string,
  circuit: string,
  driver: string
) => {
  const data = await fetchErgastData<ErgastResponse>(
    `/${season}/circuits/${circuit}/drivers/${driver}/results.json`
  )
  if (!data?.MRData?.RaceTable?.Races?.[0]) return undefined

  const race = data.MRData.RaceTable.Races[0]
  return {
    raceName: race.raceName,
    result: race.Results[0]
  }
}

// Fetch stats for both drivers in a specific race
export const getDriversRaceStats = async ({
  season,
  circuit,
  driverOne,
  driverTwo
}: {
  season: string
  circuit: string
  driverOne: string
  driverTwo: string
}) => {
  const [driverOneStats, driverTwoStats] = await Promise.all([
    getDriverRaceResult(season, circuit, driverOne),
    getDriverRaceResult(season, circuit, driverTwo)
  ])

  if (!driverOneStats?.result || !driverTwoStats?.result) return undefined

  return {
    raceName: driverOneStats.raceName,
    driverOne: {
      position: driverOneStats.result.position,
      grid: driverOneStats.result.grid,
      points: driverOneStats.result.points,
      laps: driverOneStats.result.laps,
      status: driverOneStats.result.status,
      finishTime: driverOneStats.result.Time?.time,
      fastestLap: driverOneStats.result.FastestLap?.Time.time,
      fastestLapRank: driverOneStats.result.FastestLap?.rank
    },
    driverTwo: {
      position: driverTwoStats.result.position,
      grid: driverTwoStats.result.grid,
      points: driverTwoStats.result.points,
      laps: driverTwoStats.result.laps,
      status: driverTwoStats.result.status,
      finishTime: driverTwoStats.result.Time?.time,
      fastestLap: driverTwoStats.result.FastestLap?.Time.time,
      fastestLapRank: driverTwoStats.result.FastestLap?.rank
    }
  }
}

// Fetch the season champion
export const getSeasonChampion = async (season: string) => {
  const data = await fetchErgastData<ErgastResponse>(
    `/${season}/driverStandings/1.json`
  )
  if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings?.[0])
    return undefined

  const champion =
    data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]
  return {
    driverName: `${champion.Driver.givenName} ${champion.Driver.familyName}`,
    points: Number(champion.points),
    wins: Number(champion.wins),
    position: Number(champion.position)
  }
}

// Fetch constructor standings
export const getConstructorStandings = async ({
  season,
  constructorId
}: {
  season: string
  constructorId: string
}) => {
  const data = await fetchErgastData<ErgastResponse>(
    `/${season}/constructorStandings.json`
  )
  if (!data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings)
    return undefined

  const standing =
    data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.find(
      constructor => constructor.Constructor.constructorId === constructorId
    )
  if (!standing) return undefined

  return {
    position: Number(standing.position),
    points: Number(standing.points),
    wins: Number(standing.wins),
    constructorName: standing.Constructor.name,
    nationality: standing.Constructor.nationality
  }
}

// Fetch legendary rivalry season stats
export const getLegendaryRivalrySeasonStats = async ({
  year,
  driverOne,
  driverTwo
}: {
  year: number
  driverOne: string
  driverTwo: string
}) => {
  const yearString = year.toString()
  const seasonStats = await getDriversSeasonStats({
    season: yearString,
    driverOne,
    driverTwo
  })

  if (!seasonStats) return undefined

  return {
    ...seasonStats,
    year
  }
}

// Fetch overall results for a legendary rivalry
export const getLegendaryRivalryOverallResults = async (rivalry: {
  seasons: Array<{ year: number }>
  drivers: Array<{ slug: string }>
}) => {
  const seasonsResults = await Promise.all(
    rivalry.seasons.map(season =>
      getLegendaryRivalrySeasonStats({
        year: season.year,
        driverOne: rivalry.drivers[0].slug,
        driverTwo: rivalry.drivers[1].slug
      })
    )
  )

  const stats = {
    driverOne: {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      championships: 0,
      gridFirst: 0,
      averagePosition: 0,
      averageGridPosition: 0,
      pointsPerRace: 0,
      poleToWinRatio: 0,
      dnfs: 0,
      racesFinished: 0
    },
    driverTwo: {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      championships: 0,
      gridFirst: 0,
      averagePosition: 0,
      averageGridPosition: 0,
      pointsPerRace: 0,
      poleToWinRatio: 0,
      dnfs: 0,
      racesFinished: 0
    }
  }

  let totalRaces = 0
  seasonsResults.forEach(season => {
    if (!season) return
    totalRaces += season.driverOneTotalRaces

    stats.driverOne.points += Number(season.driverOnePoints)
    stats.driverOne.wins += Number(season.driverOneWins)
    stats.driverOne.poles += season.driverOnePoles
    stats.driverOne.gridFirst += season.driverOnePoles
    stats.driverOne.podiums += season.driverOnePodiums
    stats.driverOne.fastestLaps += season.driverOneFastestLaps
    stats.driverOne.dnfs += season.driverOneBetterFinishes
    if (Number(season.driverOnePosition) === 1) stats.driverOne.championships++

    stats.driverTwo.points += Number(season.driverTwoPoints)
    stats.driverTwo.wins += Number(season.driverTwoWins)
    stats.driverTwo.poles += season.driverTwoPoles
    stats.driverTwo.gridFirst += season.driverTwoPoles
    stats.driverTwo.podiums += season.driverTwoPodiums
    stats.driverTwo.fastestLaps += season.driverTwoFastestLaps
    stats.driverTwo.dnfs += season.driverTwoBetterFinishes
    if (Number(season.driverTwoPosition) === 1) stats.driverTwo.championships++
  })

  // Calculate averages and ratios
  if (totalRaces > 0) {
    stats.driverOne.racesFinished = totalRaces - stats.driverOne.dnfs
    stats.driverOne.pointsPerRace = Number(
      (stats.driverOne.points / totalRaces).toFixed(1)
    )
    stats.driverOne.averagePosition = 0 // Would need race-by-race data
    stats.driverOne.averageGridPosition = 0 // Would need race-by-race data
    stats.driverOne.poleToWinRatio =
      stats.driverOne.poles > 0
        ? Number(
            ((stats.driverOne.wins / stats.driverOne.poles) * 100).toFixed(1)
          )
        : 0

    stats.driverTwo.racesFinished = totalRaces - stats.driverTwo.dnfs
    stats.driverTwo.pointsPerRace = Number(
      (stats.driverTwo.points / totalRaces).toFixed(1)
    )
    stats.driverTwo.averagePosition = 0 // Would need race-by-race data
    stats.driverTwo.averageGridPosition = 0 // Would need race-by-race data
    stats.driverTwo.poleToWinRatio =
      stats.driverTwo.poles > 0
        ? Number(
            ((stats.driverTwo.wins / stats.driverTwo.poles) * 100).toFixed(1)
          )
        : 0
  }

  return stats
}

// Fetch team race result
export const getTeamRaceResult = async ({
  season,
  round,
  team
}: {
  season: string
  round: string
  team: string
}) => {
  const data = await fetchErgastData<ErgastResponse>(
    `/${season}/${round}/constructors/${team}/results.json`
  )
  if (!data?.MRData?.RaceTable?.Races?.[0]) return undefined

  const race = data.MRData.RaceTable.Races[0]
  return {
    raceName: race.raceName,
    results: race.Results
  }
}
