export interface DriverStats {
  poles: number
  gridAverage: number
  raceAverage: number
  points?: {
    points: string
    position: string
    wins: string
  }
  status: any
  races: any[]
  fastestLaps: number
  podiums: number
  positionChanges: PositionChange[]
  totalPositionsGained: number
  poleToWinRatio: number
  lapsCompleted: number
  totalRaces: number
  pointsPerRace: number
  completedLaps: number
  lapCompletionPercentage: number
  podiumPercentage: number
  finishedRaces: number
  dnfRaces: number
}

export interface PositionChange {
  race: string
  flag: string
  grid: number
  finish: number
  placesGained: number
  status: string
}

export interface ComparisonResult {
  driver1Better: number
  driver2Better: number
}

export interface DriversSeasonStats {
  driverOneGridAverage: number
  driverOneRaceAverage: number
  driverTwoGridAverage: number
  driverTwoRaceAverage: number
  driverOnePoints: string
  driverTwoPoints: string
  driverOnePosition: string
  driverTwoPosition: string
  driverOneWins: string
  driverTwoWins: string
  driverOnePoles: number
  driverTwoPoles: number
  driverOneBetterFinishes: number
  driverTwoBetterFinishes: number
  driverOneBetterGrid: number
  driverTwoBetterGrid: number
  driverOneStatus: any
  driverTwoStatus: any
  driverOnePositionChanges: PositionChange[]
  driverTwoPositionChanges: PositionChange[]
  driverOneTotalPositionsGained: number
  driverTwoTotalPositionsGained: number
  driverOneFastestLaps: number
  driverTwoFastestLaps: number
  driverOnePodiums: number
  driverTwoPodiums: number
  driverOnePoleToWinRatio: number
  driverTwoPoleToWinRatio: number
  driverOneTotalRaces: number
  driverTwoTotalRaces: number
  driverOnePointsPerRace: number
  driverTwoPointsPerRace: number
  driverOneCompletedLaps: number
  driverTwoCompletedLaps: number
  driverOneLapCompletion: number
  driverTwoLapCompletion: number
  driverOnePodiumPercentage: number
  driverTwoPodiumPercentage: number
}

export interface LegendaryRivalry {
  id: number
  slug: string
  team: string
  seasons: Array<{ year: number }>
  primaryColor: string
  secondaryColor: string
  drivers: Array<{
    id: number
    firstName: string
    lastName: string
    code: string
    pictureUrl: string
    slug: string
  }>
}

export interface LegendaryRivalryStats {
  driverOne: {
    points: number
    wins: number
    gridFirst: number
    podiums: number
    fastestLaps: number
    positions: number[]
    gridPositions: number[]
    qualifyingPositions: number[]
    championships: number
    averagePosition: number
    averageGridPosition: number
    averageQualifyingPosition: number | null
    pointsPerRace: number
    poleToWinRatio: number
    dnfs: number
    racesFinished: number
    gridFirsts: number
  }
  driverTwo: {
    points: number
    wins: number
    gridFirst: number
    podiums: number
    fastestLaps: number
    positions: number[]
    gridPositions: number[]
    qualifyingPositions: number[]
    championships: number
    averagePosition: number
    averageGridPosition: number
    averageQualifyingPosition: number | null
    pointsPerRace: number
    poleToWinRatio: number
    dnfs: number
    racesFinished: number
    gridFirsts: number
  }
}

interface StatComparison {
  d1: number
  d2: number
  higherIsBetter: boolean
}

export interface LegendaryComparison {
  points: StatComparison
  wins: StatComparison
  gridFirst: StatComparison
  podiums: StatComparison
  fastestLaps: StatComparison
  averagePosition: StatComparison
  averageGridPosition: StatComparison
  averageQualifyingPosition: StatComparison
  pointsPerRace: StatComparison
  poleToWinRatio: StatComparison
  championships: StatComparison
  dnfs: StatComparison
}
