// API Response Types
export interface ErgastResponse {
  MRData: {
    total: string
    RaceTable?: {
      Races: Race[]
    }
    StandingsTable?: {
      StandingsLists: Array<{
        ConstructorStandings?: Constructor[]
        DriverStandings?: Driver[]
      }>
    }
    StatusTable?: {
      Status: StatusEntry[]
    }
  }
}

export interface Race {
  raceName: string
  date: string
  Circuit: {
    circuitId: string
  }
  Results: RaceResult[]
}

export interface RaceResult {
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

export interface Constructor {
  Constructor: {
    name: string
    constructorId: string
    nationality: string
  }
  position: string
  points: string
  wins: string
}

export interface Driver {
  Driver: {
    driverId: string
    givenName: string
    familyName: string
  }
  points: string
  position: string
  wins: string
}

export interface StatusEntry {
  count: string
  status: string
}

// Stats Types
export interface DriverStats {
  poles: number
  podiums: number
  completedLaps: number
  poleToWinRatio: number
  podiumPercentage: number
  points: Driver | undefined
  status: StatusEntry[]
  races: Race[]
  fastestLaps: number
  positionChanges: PositionChange[]
  totalPositionsGained: number
  lapsCompleted: number
  totalRaces: number
  pointsPerRace: number
  finishedRaces: number
  dnfRaces: number
  lapCompletionPercentage: number
  gridAverage: number
  raceAverage: number
}

export interface PositionChange {
  race: string
  grid: number
  finish: number
  placesGained: number
  status: string
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
  driverOneStatus: StatusEntry[]
  driverTwoStatus: StatusEntry[]
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
