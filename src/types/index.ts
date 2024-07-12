export interface TeamInfo {
  id: string
  name: string
  base: string
  teamChief: string
  technicalChief: string
  chassis: string
  powerUnit: string
  color: string
  firstEntry: number
  championshipsWon: number
  racesParticipated: number
  wins: number
  podiums: number
  poles: number
  fastestLaps: number
  points: number
  createdAt: string
  updatedAt: string
}

export interface SeasonInfo {
  id: string
  year: number
}

export interface DriverInfo {
  id: string
  firstName: string
  lastName: string
  nameId: string
  pictureUrl: string
  dateOfBirth: string
  nationality: string
  carNumber: number
  championshipsWon: number
  racesParticipated: number
  podiums: number
  wins: number
  poles: number
  fastestLaps: number
  points: number
  createdAt: string
  updatedAt: string
}

export interface SeasonTeam {
  slug: string
  team: TeamInfo
  season: SeasonInfo
  drivers: DriverInfo[]
}
