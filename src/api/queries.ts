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
  LegendaryRivalry,
  LegendaryRivalryStats
} from '@/api/types'
import { SEASON_LAPS_2024 } from '@/api/constants'

// Add interfaces for API responses
interface RaceResult {
  grid: string
  position: string
  points: string
  laps: string
  status: string
  Time?: { time: string }
  FastestLap?: {
    rank: string
    Time: { time: string }
  }
  Driver: {
    driverId: string
  }
}

interface Race {
  raceName: string
  Results: RaceResult[]
}

interface ErgastResponse {
  MRData: {
    xmlns: string
    series: string
    url: string
    limit: string
    offset: string
    total: string
    StandingsTable?: {
      season: string
      StandingsLists: Array<{
        ConstructorStandings?: ConstructorStanding[]
        DriverStandings?: DriverStanding[]
      }>
    }
    RaceTable?: {
      season: string
      Races: Race[]
    }
    StatusTable?: {
      Status: any[]
    }
  }
}

interface RaceData {
  RaceTable: {
    Races: Race[]
    total?: string
  }
}

interface DriverStanding {
  Driver: {
    driverId: string
    givenName: string
    familyName: string
  }
  points: string
  position: string
  wins: string
}

interface StandingsData {
  StandingsTable: {
    StandingsLists: Array<{
      DriverStandings: DriverStanding[]
    }>
  }
}

interface StatusData {
  StatusTable: {
    Status: any[]
  }
}

interface ConstructorStanding {
  Constructor: {
    name: string
    constructorId: string
    nationality: string
  }
  position: string
  points: string
  wins: string
}

interface ConstructorData {
  StandingsTable: {
    StandingsLists: Array<{
      ConstructorStandings: ConstructorStanding[]
    }>
  }
}

// Helper function to safely access nested properties
const safeGet = <T, K extends keyof T>(
  obj: T | undefined,
  key: K
): T[K] | undefined => (obj ? obj[key] : undefined)

// Fetch season races data with better typing
export const getSeasonRaces = async (seasonSlug: string) => {
  const response = await fetchErgastData<ErgastResponse>(`/${seasonSlug}.json`)

  if (!response?.MRData?.RaceTable?.Races) {
    return undefined
  }

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

// Fetch driver stats with better error handling and typing
const getDriverStats = async (
  seasonSlug: string,
  driverId: string
): Promise<DriverStats | undefined> => {
  try {
    const [seasonData, raceData, statusData] = await Promise.all([
      fetchErgastData<ErgastResponse>(`/${seasonSlug}/driverStandings.json`),
      fetchErgastData<ErgastResponse>(
        `/${seasonSlug}/drivers/${driverId}/results.json`
      ),
      fetchErgastData<ErgastResponse>(
        `/${seasonSlug}/drivers/${driverId}/status.json`
      )
    ])

    if (!raceData?.MRData?.RaceTable?.Races) {
      console.error('No race data found for driver:', driverId)
      return undefined
    }

    const races = raceData.MRData.RaceTable.Races
    const raceCompletion = calculateRaceCompletion(statusData)
    const driverStandings =
      seasonData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings
    const points = driverStandings?.find(
      driver => driver.Driver.driverId === driverId
    )

    const basicStats = calculateDriverStats(raceData, points)
    const raceStats = calculateRaceStats(races, driverId)

    return {
      poles: raceStats.poles,
      podiums: raceStats.podiums,
      completedLaps: raceStats.completedLaps,
      poleToWinRatio: raceStats.poleToWinRatio,
      podiumPercentage: raceStats.podiumPercentage,
      points,
      status: statusData?.MRData?.StatusTable?.Status ?? [],
      races,
      fastestLaps: basicStats.fastestLaps ?? 0,
      positionChanges: basicStats.positionChanges ?? [],
      totalPositionsGained: basicStats.totalPositionsGained ?? 0,
      lapsCompleted: basicStats.lapsCompleted ?? 0,
      totalRaces: basicStats.totalRaces ?? 0,
      pointsPerRace: basicStats.pointsPerRace ?? 0,
      finishedRaces: raceCompletion.finishedRaces,
      dnfRaces: raceCompletion.dnfRaces,
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
    console.error('Error in getDriverStats:', error)
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
  try {
    const [driverOneStats, driverTwoStats] = await Promise.all([
      getDriverStats(season, driverOne),
      getDriverStats(season, driverTwo)
    ])

    if (!driverOneStats || !driverTwoStats) {
      console.error('Missing driver stats:', {
        driverOneStats: !!driverOneStats,
        driverTwoStats: !!driverTwoStats
      })
      return undefined
    }

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
  } catch (error) {
    console.error('Error in getDriversSeasonStats:', error)
    return undefined
  }
}

// Fetch driver race result for a specific season and circuit
const getDriverRaceResult = async (
  season: string,
  circuit: string,
  driver: string
) => {
  try {
    const data = await fetchErgastData<ErgastResponse>(
      `/${season}/circuits/${circuit}/drivers/${driver}/results.json`
    )
    if (!data?.MRData?.RaceTable?.Races?.[0]) return undefined

    const race = data.MRData.RaceTable.Races[0]
    return {
      raceName: race.raceName,
      result: race.Results[0]
    }
  } catch (error) {
    console.error('Error fetching driver race result:', error)
    return undefined
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

// Fetch the season champion for a specific season
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

// Fetch constructor standings for a specific season
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

  if (
    !data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings
  ) {
    return undefined
  }

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

// Fetch season teams for a specific season
export const getSeasonTeams = async (season: string) => {
  const data = (await fetchErgastData(
    `/${season}/constructorStandings.json`
  )) as ErgastResponse
  if (
    !data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings
  ) {
    return undefined
  }

  return data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(
    constructor => ({
      name: constructor.Constructor.name,
      id: constructor.Constructor.constructorId,
      nationality: constructor.Constructor.nationality,
      position: Number(constructor.position),
      points: Number(constructor.points),
      wins: Number(constructor.wins)
    })
  )
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

  const [driverOneStatus, driverTwoStatus] = await Promise.all([
    fetchErgastData(`/${yearString}/drivers/${driverOne}/status.json`),
    fetchErgastData(`/${yearString}/drivers/${driverTwo}/status.json`)
  ])

  const driverOneCompletion = calculateRaceCompletion(driverOneStatus)
  const driverTwoCompletion = calculateRaceCompletion(driverTwoStatus)

  const seasonStats = await getDriversSeasonStats({
    season: yearString,
    driverOne,
    driverTwo
  })

  if (!seasonStats) return undefined

  const calculateQualifyingAverage = (positions: any[]) => {
    const validPositions = positions.map(p => p.grid).filter(p => p > 0)
    return validPositions.length > 0
      ? Number(
          (
            validPositions.reduce((a, b) => a + b, 0) / validPositions.length
          ).toFixed(1)
        )
      : 0
  }

  const driverOnePoles = seasonStats.driverOnePositionChanges?.filter(
    change => change.grid === 1
  ).length
  const driverTwoPoles = seasonStats.driverTwoPositionChanges.filter(
    change => change.grid === 1
  ).length

  return {
    ...seasonStats,
    driverOneFinishedRaces: driverOneCompletion.finishedRaces,
    driverOneDNFs: driverOneCompletion.dnfRaces,
    driverTwoFinishedRaces: driverTwoCompletion.finishedRaces,
    driverTwoDNFs: driverTwoCompletion.dnfRaces,
    driverOnePoles,
    driverTwoPoles,
    driverOneQualifyingAverage: calculateQualifyingAverage(
      seasonStats.driverOnePositionChanges
    ),
    driverTwoQualifyingAverage: calculateQualifyingAverage(
      seasonStats.driverTwoPositionChanges
    ),
    driverOneWinsFromPole: seasonStats.driverOnePositionChanges.filter(
      change => change.grid === 1 && change.finish === 1
    ).length,
    driverTwoWinsFromPole: seasonStats.driverTwoPositionChanges.filter(
      change => change.grid === 1 && change.finish === 1
    ).length,
    year
  }
}

// Fetch overall results for a legendary rivalry
export const getLegendaryRivalryOverallResults = async (
  rivalry: LegendaryRivalry
): Promise<LegendaryRivalryStats> => {
  const seasonsResults = await Promise.all(
    rivalry.seasons.map(season =>
      getLegendaryRivalrySeasonStats({
        year: season.year,
        driverOne: rivalry.drivers[0].slug,
        driverTwo: rivalry.drivers[1].slug
      })
    )
  )

  const combinedStats = {
    driverOne: {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      positions: [] as number[],
      gridPositions: [] as number[],
      qualifyingPositions: [] as number[],
      championships: 0,
      totalRaces: 0,
      winsFromPole: 0,
      dnfs: 0,
      racesFinished: 0
    },
    driverTwo: {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      positions: [] as number[],
      gridPositions: [] as number[],
      qualifyingPositions: [] as number[],
      championships: 0,
      totalRaces: 0,
      winsFromPole: 0,
      dnfs: 0,
      racesFinished: 0
    }
  }

  seasonsResults.forEach(season => {
    if (!season) return

    // Update race statistics for both drivers
    combinedStats.driverOne.totalRaces += season.driverOnePositionChanges.length
    combinedStats.driverTwo.totalRaces += season.driverTwoPositionChanges.length

    // Driver One stats
    combinedStats.driverOne.points += Number(season.driverOnePoints)
    combinedStats.driverOne.wins += Number(season.driverOneWins)
    combinedStats.driverOne.poles += Number(season.driverOnePoles)
    combinedStats.driverOne.podiums += Number(season.driverOnePodiums)
    combinedStats.driverOne.fastestLaps += Number(season.driverOneFastestLaps)
    combinedStats.driverOne.positions.push(
      ...season.driverOnePositionChanges.map(change => change.finish)
    )
    combinedStats.driverOne.gridPositions.push(
      ...season.driverOnePositionChanges.map(change => change.grid)
    )
    combinedStats.driverOne.winsFromPole += Number(season.driverOneWinsFromPole)
    combinedStats.driverOne.dnfs += Number(season.driverOneDNFs)

    // Driver Two stats
    combinedStats.driverTwo.points += Number(season.driverTwoPoints)
    combinedStats.driverTwo.wins += Number(season.driverTwoWins)
    combinedStats.driverTwo.poles += Number(season.driverTwoPoles)
    combinedStats.driverTwo.podiums += Number(season.driverTwoPodiums)
    combinedStats.driverTwo.fastestLaps += Number(season.driverTwoFastestLaps)
    combinedStats.driverTwo.positions.push(
      ...season.driverTwoPositionChanges.map(change => change.finish)
    )
    combinedStats.driverTwo.gridPositions.push(
      ...season.driverTwoPositionChanges.map(change => change.grid)
    )
    combinedStats.driverTwo.winsFromPole += Number(season.driverTwoWinsFromPole)
    combinedStats.driverTwo.dnfs += Number(season.driverTwoDNFs)

    // Championship counts
    if (Number(season.driverOnePosition) === 1)
      combinedStats.driverOne.championships++
    if (Number(season.driverTwoPosition) === 1)
      combinedStats.driverTwo.championships++
  })

  // Calculate races finished
  combinedStats.driverOne.racesFinished =
    combinedStats.driverOne.totalRaces - combinedStats.driverOne.dnfs
  combinedStats.driverTwo.racesFinished =
    combinedStats.driverTwo.totalRaces - combinedStats.driverTwo.dnfs

  const calculateAverage = (arr: number[]) =>
    arr.length > 0
      ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1)
      : '0'

  return {
    driverOne: {
      ...combinedStats.driverOne,
      averagePosition: Number(
        calculateAverage(combinedStats.driverOne.positions)
      ),
      averageGridPosition: Number(
        calculateAverage(combinedStats.driverOne.gridPositions)
      ),
      averageQualifyingPosition:
        combinedStats.driverOne.qualifyingPositions.length > 0
          ? Number(
              calculateAverage(combinedStats.driverOne.qualifyingPositions)
            )
          : null,
      pointsPerRace: Number(
        (
          combinedStats.driverOne.points / combinedStats.driverOne.totalRaces
        ).toFixed(1)
      ),
      poleToWinRatio:
        combinedStats.driverOne.poles > 0
          ? Number(
              (
                (combinedStats.driverOne.winsFromPole /
                  combinedStats.driverOne.poles) *
                100
              ).toFixed(1)
            )
          : 0,
      gridFirst: combinedStats.driverOne.poles,
      gridFirsts: combinedStats.driverOne.poles
    },
    driverTwo: {
      ...combinedStats.driverTwo,
      averagePosition: Number(
        calculateAverage(combinedStats.driverTwo.positions)
      ),
      averageGridPosition: Number(
        calculateAverage(combinedStats.driverTwo.gridPositions)
      ),
      averageQualifyingPosition:
        combinedStats.driverTwo.qualifyingPositions.length > 0
          ? Number(
              calculateAverage(combinedStats.driverTwo.qualifyingPositions)
            )
          : null,
      pointsPerRace: Number(
        (
          combinedStats.driverTwo.points / combinedStats.driverTwo.totalRaces
        ).toFixed(1)
      ),
      poleToWinRatio:
        combinedStats.driverTwo.poles > 0
          ? Number(
              (
                (combinedStats.driverTwo.winsFromPole /
                  combinedStats.driverTwo.poles) *
                100
              ).toFixed(1)
            )
          : 0,
      gridFirst: combinedStats.driverTwo.poles,
      gridFirsts: combinedStats.driverTwo.poles
    }
  }
}
