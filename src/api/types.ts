// API Response Types
export interface ErgastResponse {
  MRData: {
    xmlns: string
    series: string
    url: string
    limit: string
    offset: string
    total: string
    RaceTable: {
      season: string
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
  season: string
  round: string
  url: string
  raceName: string
  Circuit: Circuit
  date: string
  time: string
  Results: Result[]
}

export interface Circuit {
  circuitId: string
  url: string
  circuitName: string
  Location: Location
}

export interface Location {
  lat: string
  long: string
  locality: string
  country: string
}

export interface Result {
  number: string
  position: string
  positionText: string
  points: string
  Driver: Driver
  Constructor: Constructor
  grid: string
  laps: string
  status: string
  Time?: {
    millis: string
    time: string
  }
  FastestLap?: {
    rank: string
    lap: string
    Time: {
      time: string
    }
    AverageSpeed: {
      units: string
      speed: string
    }
  }
}

export interface Driver {
  driverId: string
  permanentNumber: string
  code: string
  url: string
  givenName: string
  familyName: string
  dateOfBirth: string
  nationality: string
  points?: string
  position?: string
  wins?: string
}

export interface Constructor {
  constructorId: string
  url: string
  name: string
  nationality: string
  points?: string
  position?: string
  wins?: string
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
  points: {
    points: string
    position: string
    wins: string
  }
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
  driverOnePosition: string
  driverOnePoints: string
  driverOneWins: number
  driverOnePoles: number
  driverOnePodiums: number
  driverOneFastestLaps: number
  driverOneBetterFinishes: number
  driverOneBetterGrid: number
  driverOneRaceAverage: number
  driverOneGridAverage: number
  driverOneCompletedLaps: number
  driverOnePodiumPercentage: number
  driverOnePoleToWinRatio: number
  driverOnePointsPerRace: number
  driverOneTotalRaces: number
  driverOnePositionChanges: number[]
  driverOneTotalPositionsGained: number
  driverOneResults: Race[]

  driverTwoPosition: string
  driverTwoPoints: string
  driverTwoWins: number
  driverTwoPoles: number
  driverTwoPodiums: number
  driverTwoFastestLaps: number
  driverTwoBetterFinishes: number
  driverTwoBetterGrid: number
  driverTwoRaceAverage: number
  driverTwoGridAverage: number
  driverTwoCompletedLaps: number
  driverTwoPodiumPercentage: number
  driverTwoPoleToWinRatio: number
  driverTwoPointsPerRace: number
  driverTwoTotalRaces: number
  driverTwoPositionChanges: number[]
  driverTwoTotalPositionsGained: number
  driverTwoResults: Race[]
}

export interface DriverStanding {
  position: string
  positionText: string
  points: string
  wins: string
  Driver: {
    driverId: string
    permanentNumber: string
    code: string
    url: string
    givenName: string
    familyName: string
    dateOfBirth: string
    nationality: string
  }
  Constructors: Array<{
    constructorId: string
    url: string
    name: string
    nationality: string
  }>
}

export interface DriverStandingsResponse {
  MRData: {
    xmlns: string
    series: string
    url: string
    limit: string
    offset: string
    total: string
    StandingsTable: {
      season: string
      round: string
      StandingsLists: Array<{
        season: string
        round: string
        DriverStandings: DriverStanding[]
      }>
    }
  }
}
