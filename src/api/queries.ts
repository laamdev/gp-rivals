import { fetchErgastData } from '@/api'
import { comparePositions } from '@/api/helpers'
import {
  DriversSeasonStats,
  DriverStats,
  ErgastResponse,
  DriverStandingsResponse,
  DriverStanding,
  PositionChange
} from '@/api/types'
import { FINISHED_STATUSES } from '@/api/constants'

// Fetch driver stats
const getDriverStats = async (
  seasonSlug: string,
  driverId: string
): Promise<DriverStats | undefined> => {
  try {
    const raceData = await fetchErgastData<ErgastResponse>(
      `/${seasonSlug}/drivers/${driverId}/results.json`
    )

    if (!raceData?.MRData?.RaceTable?.Races) {
      return undefined
    }

    const races = raceData.MRData.RaceTable.Races
    const totalRaces = races.length

    // Calculate points and position from race results
    const points = races
      .reduce((sum, race) => {
        // Check if Results array exists and has elements
        if (!race.Results || race.Results.length === 0) return sum
        return sum + Number(race.Results[0]?.points || 0)
      }, 0)
      .toString()

    const position =
      races.length > 0 && races[races.length - 1].Results?.[0]
        ? races[races.length - 1].Results[0].position
        : ''

    const wins = races
      .filter(race => race.Results?.[0]?.position === '1')
      .length.toString()

    // Calculate basic stats
    const poles = races.filter(race => race.Results?.[0]?.grid === '1').length
    const podiums = races.filter(race => {
      if (!race.Results?.[0]) return false
      const pos = parseInt(race.Results[0].position)
      return !isNaN(pos) && pos <= 3
    }).length

    const completedLaps = races.reduce((sum, race) => {
      if (!race.Results?.[0]) return sum
      return sum + parseInt(race.Results[0].laps || '0')
    }, 0)

    const fastestLaps = races.filter(
      race => race.Results?.[0]?.FastestLap?.rank === '1'
    ).length

    // Calculate pole to win ratio - only count races where driver started from pole and won
    const winsFromPole = races.filter(
      race =>
        race.Results?.[0]?.grid === '1' && race.Results?.[0]?.position === '1'
    ).length

    const poleToWinRatio =
      poles > 0 ? Number(((winsFromPole / poles) * 100).toFixed(2)) : 0

    // Calculate grid and race position averages
    const gridPositions = races
      .map(race => Number(race.Results?.[0]?.grid || 0))
      .filter(pos => pos > 0)

    const racePositions = races
      .map(race => Number(race.Results?.[0]?.position || 0))
      .filter(pos => pos > 0)

    const gridAverage =
      gridPositions.length > 0
        ? Number(
            (
              gridPositions.reduce((sum, pos) => sum + pos, 0) /
              gridPositions.length
            ).toFixed(2)
          )
        : 0

    const raceAverage =
      racePositions.length > 0
        ? Number(
            (
              racePositions.reduce((sum, pos) => sum + pos, 0) /
              racePositions.length
            ).toFixed(2)
          )
        : 0

    // Calculate position changes and DNF stats
    const positionChanges: PositionChange[] = races.map(race => {
      if (!race.Results?.[0]) {
        return {
          race: race.raceName,
          grid: 0,
          finish: 0,
          placesGained: 0,
          status: 'Did not participate'
        }
      }
      const grid = parseInt(race.Results[0].grid)
      const finish = parseInt(race.Results[0].position)
      if (isNaN(grid) || isNaN(finish)) {
        return {
          race: race.raceName,
          grid: 0,
          finish: 0,
          placesGained: 0,
          status: race.Results[0].status || 'Unknown'
        }
      }
      return {
        race: race.raceName,
        grid,
        finish,
        placesGained: grid - finish,
        status: race.Results[0].status
      }
    })

    const totalPositionsGained = positionChanges.reduce(
      (sum, change) => sum + change.placesGained,
      0
    )

    const finishedRaces = races.filter(race =>
      FINISHED_STATUSES.includes(race.Results?.[0]?.status || '')
    ).length

    const dnfRaces = races.filter(
      race => !FINISHED_STATUSES.includes(race.Results?.[0]?.status || '')
    ).length

    return {
      poles,
      podiums,
      completedLaps,
      poleToWinRatio,
      podiumPercentage:
        totalRaces > 0 ? Number(((podiums / totalRaces) * 100).toFixed(2)) : 0,
      points: { points, position, wins },
      status: [], // This would need circuit-specific status data
      races,
      fastestLaps,
      positionChanges,
      totalPositionsGained,
      lapsCompleted: completedLaps,
      totalRaces,
      pointsPerRace:
        totalRaces > 0 ? Number((parseInt(points) / totalRaces).toFixed(2)) : 0,
      finishedRaces,
      dnfRaces,
      lapCompletionPercentage: 0, // This would need total possible laps data
      gridAverage,
      raceAverage
    }
  } catch (error) {
    console.error('Error fetching driver stats:', error)
    return undefined
  }
}

// Helper function to map driver stats to season stats format
const mapDriverToSeasonStats = (
  stats: DriverStats,
  prefix: 'driverOne' | 'driverTwo'
) => {
  return {
    [`${prefix}GridAverage`]: stats.gridAverage,
    [`${prefix}RaceAverage`]: stats.raceAverage,
    [`${prefix}Points`]: stats.points.points,
    [`${prefix}Position`]: stats.points.position,
    [`${prefix}Wins`]: Number(stats.points.wins),
    [`${prefix}Poles`]: stats.poles,
    [`${prefix}PodiumPercentage`]: stats.podiumPercentage,
    [`${prefix}Status`]: stats.status,
    [`${prefix}PositionChanges`]: stats.positionChanges.map(
      change => change.placesGained
    ),
    [`${prefix}TotalPositionsGained`]: stats.totalPositionsGained,
    [`${prefix}FastestLaps`]: stats.fastestLaps,
    [`${prefix}Podiums`]: stats.podiums,
    [`${prefix}PoleToWinRatio`]: stats.poleToWinRatio,
    [`${prefix}TotalRaces`]: stats.totalRaces,
    [`${prefix}PointsPerRace`]: stats.pointsPerRace,
    [`${prefix}CompletedLaps`]: stats.completedLaps,
    [`${prefix}LapCompletion`]: stats.lapCompletionPercentage,
    [`${prefix}Results`]: stats.races
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
  const [driverOneStats, driverTwoStats, driverStandings] = await Promise.all([
    getDriverStats(season, driverOne),
    getDriverStats(season, driverTwo),
    getDriverStandings(season)
  ])

  // Create default stats for when a driver has no data
  const defaultDriverStats: DriverStats = {
    poles: 0,
    podiums: 0,
    completedLaps: 0,
    poleToWinRatio: 0,
    podiumPercentage: 0,
    points: { points: '0', position: '0', wins: '0' },
    status: [],
    races: [],
    fastestLaps: 0,
    positionChanges: [],
    totalPositionsGained: 0,
    lapsCompleted: 0,
    totalRaces: 0,
    pointsPerRace: 0,
    finishedRaces: 0,
    dnfRaces: 0,
    lapCompletionPercentage: 0,
    gridAverage: 0,
    raceAverage: 0
  }

  // Use default stats if either driver's stats are undefined
  const finalDriverOneStats = driverOneStats || defaultDriverStats
  const finalDriverTwoStats = driverTwoStats || defaultDriverStats

  const driverOneStanding = driverStandings?.find(
    standing => standing.Driver.driverId === driverOne
  )
  const driverTwoStanding = driverStandings?.find(
    standing => standing.Driver.driverId === driverTwo
  )

  // Get championship leader's points
  const championshipLeaderPoints = driverStandings?.[0]?.points || '0'

  const raceComparison = comparePositions(
    finalDriverOneStats.races,
    finalDriverTwoStats.races,
    'race'
  )
  const gridComparison = comparePositions(
    finalDriverOneStats.races,
    finalDriverTwoStats.races,
    'grid'
  )

  const driverOneSeasonStats = mapDriverToSeasonStats(
    finalDriverOneStats,
    'driverOne'
  )
  const driverTwoSeasonStats = mapDriverToSeasonStats(
    finalDriverTwoStats,
    'driverTwo'
  )

  return {
    ...driverOneSeasonStats,
    ...driverTwoSeasonStats,
    driverOneBetterFinishes: raceComparison.driver1Better,
    driverTwoBetterFinishes: raceComparison.driver2Better,
    driverOneBetterGrid: gridComparison.driver1Better,
    driverTwoBetterGrid: gridComparison.driver2Better,
    driverOnePosition:
      driverOneStanding?.position || finalDriverOneStats.points.position || '0',
    driverOnePoints:
      driverOneStanding?.points || finalDriverOneStats.points.points || '0',
    driverOneWins: Number(
      driverOneStanding?.wins || finalDriverOneStats.points.wins || '0'
    ),
    driverTwoPosition:
      driverTwoStanding?.position || finalDriverTwoStats.points.position || '0',
    driverTwoPoints:
      driverTwoStanding?.points || finalDriverTwoStats.points.points || '0',
    driverTwoWins: Number(
      driverTwoStanding?.wins || finalDriverTwoStats.points.wins || '0'
    ),
    championshipLeaderPoints
  } as DriversSeasonStats
}

// Fetch driver standings
export const getDriverStandings = async (
  season: string
): Promise<DriverStanding[] | undefined> => {
  const response = await fetchErgastData<DriverStandingsResponse>(
    `/${season}/driverstandings.json`
  )

  if (!response?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
    return undefined
  }

  return response.MRData.StandingsTable.StandingsLists[0].DriverStandings
}

//! LEGENDARY

// Types for legendary rivalry stats
interface LegendaryDriverSeasonStats {
  points: number
  wins: number
  poles: number
  podiums: number
  fastestLaps: number
  position: number
  races: number
  dnfs: number
}

interface LegendarySeasonStats {
  year: number
  driverOne: LegendaryDriverSeasonStats
  driverTwo: LegendaryDriverSeasonStats
}

interface LegendaryOverallStats {
  driverOne: {
    points: number
    wins: number
    poles: number
    podiums: number
    fastestLaps: number
    championships: number
    pointsPerRace: number
    poleToWinRatio: number
    dnfs: number
    racesFinished: number
  }
  driverTwo: {
    points: number
    wins: number
    poles: number
    podiums: number
    fastestLaps: number
    championships: number
    pointsPerRace: number
    poleToWinRatio: number
    dnfs: number
    racesFinished: number
  }
  totalRaces: number
}

// Fetch stats for a single season of a legendary rivalry
export const getLegendarySeasonStats = async ({
  year,
  driverOne,
  driverTwo
}: {
  year: number
  driverOne: string
  driverTwo: string
}): Promise<LegendarySeasonStats | undefined> => {
  try {
    // Fetch driver standings for the year
    const standingsResponse = await fetch(
      `https://api.jolpi.ca/ergast/f1/${year}/driverstandings/`
    )
    const standingsData = await standingsResponse.json()

    // Fetch results for both drivers
    const [driverOneResultsResponse, driverTwoResultsResponse] =
      await Promise.all([
        fetch(
          `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverOne}/results.json`
        ),
        fetch(
          `https://api.jolpi.ca/ergast/f1/${year}/drivers/${driverTwo}/results.json`
        )
      ])

    const driverOneResults = await driverOneResultsResponse.json()
    const driverTwoResults = await driverTwoResultsResponse.json()

    // Process driver one results
    const driverOneStats: LegendaryDriverSeasonStats = {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      position: 0,
      races: 0,
      dnfs: 0
    }

    // Process driver two results
    const driverTwoStats: LegendaryDriverSeasonStats = {
      points: 0,
      wins: 0,
      poles: 0,
      podiums: 0,
      fastestLaps: 0,
      position: 0,
      races: 0,
      dnfs: 0
    }

    // Process standings data
    const standings =
      standingsData.MRData.StandingsTable.StandingsLists[0].DriverStandings
    for (const standing of standings) {
      if (standing.Driver.driverId === driverOne) {
        driverOneStats.points = Number(standing.points)
        driverOneStats.position = Number(standing.position)
      } else if (standing.Driver.driverId === driverTwo) {
        driverTwoStats.points = Number(standing.points)
        driverTwoStats.position = Number(standing.position)
      }
    }

    // Process driver one race results
    const driverOneRaces = driverOneResults.MRData.RaceTable.Races
    driverOneStats.races = driverOneRaces.length
    for (const race of driverOneRaces) {
      const result = race.Results[0]
      if (result.position === '1') driverOneStats.wins++
      if (Number(result.position) <= 3) driverOneStats.podiums++
      if (result.grid === '1') driverOneStats.poles++
      if (result.FastestLap?.rank === '1') driverOneStats.fastestLaps++
      if (result.status !== 'Finished' && !result.status.startsWith('+'))
        driverOneStats.dnfs++
    }

    // Process driver two race results
    const driverTwoRaces = driverTwoResults.MRData.RaceTable.Races
    driverTwoStats.races = driverTwoRaces.length
    for (const race of driverTwoRaces) {
      const result = race.Results[0]
      if (result.position === '1') driverTwoStats.wins++
      if (Number(result.position) <= 3) driverTwoStats.podiums++
      if (result.grid === '1') driverTwoStats.poles++
      if (result.FastestLap?.rank === '1') driverTwoStats.fastestLaps++
      if (result.status !== 'Finished' && !result.status.startsWith('+'))
        driverTwoStats.dnfs++
    }

    console.log('Season stats for', year, ':', {
      driverOne: driverOneStats,
      driverTwo: driverTwoStats
    })

    return {
      year,
      driverOne: driverOneStats,
      driverTwo: driverTwoStats
    }
  } catch (error) {
    console.error('Error fetching legendary season stats:', error)
    return undefined
  }
}

// Fetch overall stats for a legendary rivalry
export const getLegendaryOverallStats = async (rivalry: {
  seasons: Array<{ year: number }>
  drivers: Array<{ slug: string }>
}): Promise<LegendaryOverallStats | undefined> => {
  try {
    // Fetch stats for each season
    const seasonsResults = await Promise.all(
      rivalry.seasons.map(season =>
        getLegendarySeasonStats({
          year: season.year,
          driverOne: rivalry.drivers[0].slug,
          driverTwo: rivalry.drivers[1].slug
        })
      )
    )

    // Filter out undefined results
    const validSeasons = seasonsResults.filter(
      (season): season is LegendarySeasonStats => season !== undefined
    )

    if (validSeasons.length === 0) {
      console.log('No valid seasons found for rivalry')
      return undefined
    }

    // Initialize overall stats
    const stats: LegendaryOverallStats = {
      driverOne: {
        points: 0,
        wins: 0,
        poles: 0,
        podiums: 0,
        fastestLaps: 0,
        championships: 0,
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
        pointsPerRace: 0,
        poleToWinRatio: 0,
        dnfs: 0,
        racesFinished: 0
      },
      totalRaces: 0
    }

    // Aggregate stats from each season
    validSeasons.forEach(season => {
      // Driver One stats
      stats.driverOne.points += season.driverOne.points
      stats.driverOne.wins += season.driverOne.wins
      stats.driverOne.poles += season.driverOne.poles
      stats.driverOne.podiums += season.driverOne.podiums
      stats.driverOne.fastestLaps += season.driverOne.fastestLaps
      stats.driverOne.dnfs += season.driverOne.dnfs
      if (season.driverOne.position === 1) stats.driverOne.championships++

      // Driver Two stats
      stats.driverTwo.points += season.driverTwo.points
      stats.driverTwo.wins += season.driverTwo.wins
      stats.driverTwo.poles += season.driverTwo.poles
      stats.driverTwo.podiums += season.driverTwo.podiums
      stats.driverTwo.fastestLaps += season.driverTwo.fastestLaps
      stats.driverTwo.dnfs += season.driverTwo.dnfs
      if (season.driverTwo.position === 1) stats.driverTwo.championships++

      // Update total races
      stats.totalRaces += season.driverOne.races
    })

    // Calculate derived stats
    stats.driverOne.racesFinished = stats.totalRaces - stats.driverOne.dnfs
    stats.driverTwo.racesFinished = stats.totalRaces - stats.driverTwo.dnfs

    stats.driverOne.pointsPerRace = Number(
      (stats.driverOne.points / stats.totalRaces).toFixed(1)
    )
    stats.driverTwo.pointsPerRace = Number(
      (stats.driverTwo.points / stats.totalRaces).toFixed(1)
    )

    stats.driverOne.poleToWinRatio =
      stats.driverOne.poles > 0
        ? Number(
            ((stats.driverOne.wins / stats.driverOne.poles) * 100).toFixed(1)
          )
        : 0
    stats.driverTwo.poleToWinRatio =
      stats.driverTwo.poles > 0
        ? Number(
            ((stats.driverTwo.wins / stats.driverTwo.poles) * 100).toFixed(1)
          )
        : 0

    console.log('Overall stats:', stats)
    return stats
  } catch (error) {
    console.error('Error fetching legendary overall stats:', error)
    return undefined
  }
}
