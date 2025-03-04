import { cn, getLegendaryComparison, isLightColor } from '@/lib/utils'

import { StatCard } from '@/components/legendary/stat-card'

interface DriverStatsProps {
  driverNumber: 1 | 2
  result: {
    driverOne: {
      championships: number
      points: number
      wins: number
      poles: number
      podiums: number
      fastestLaps: number
      pointsPerRace: number
      poleToWinRatio: number
      dnfs: number
      racesFinished: number
    }
    driverTwo: {
      championships: number
      points: number
      wins: number
      poles: number
      podiums: number
      fastestLaps: number
      pointsPerRace: number
      poleToWinRatio: number
      dnfs: number
      racesFinished: number
    }
    totalRaces: number
  }
  color: string
  driver: string
}

export const OverallDriverStats = ({
  driverNumber,
  result,
  color,
  driver
}: DriverStatsProps) => {
  const stats = [
    {
      title: 'Championships',
      value:
        driverNumber === 1
          ? result.driverOne.championships
          : result.driverTwo.championships,
      type: 'championships'
    },
    {
      title: 'Points',
      value:
        driverNumber === 1 ? result.driverOne.points : result.driverTwo.points,
      type: 'points'
    },
    {
      title: 'Points per Race',
      value:
        driverNumber === 1
          ? result.driverOne.pointsPerRace
          : result.driverTwo.pointsPerRace,
      type: 'pointsPerRace'
    },
    {
      title: 'Total Wins',
      value: driverNumber === 1 ? result.driverOne.wins : result.driverTwo.wins,
      type: 'wins'
    },
    {
      title: 'Poles',
      value:
        driverNumber === 1 ? result.driverOne.poles : result.driverTwo.poles,
      type: 'poles'
    },
    {
      title: 'Pole to Win Ratio',
      value:
        driverNumber === 1
          ? `${result.driverOne.poleToWinRatio}%`
          : `${result.driverTwo.poleToWinRatio}%`,
      type: 'poleToWinRatio'
    },
    {
      title: 'Podiums',
      value:
        driverNumber === 1
          ? result.driverOne.podiums
          : result.driverTwo.podiums,
      type: 'podiums'
    },
    {
      title: 'DNFs',
      value: driverNumber === 1 ? result.driverOne.dnfs : result.driverTwo.dnfs,
      type: 'dnfs'
    },
    {
      title: 'Races Finished',
      value:
        driverNumber === 1
          ? result.driverOne.racesFinished
          : result.driverTwo.racesFinished,
      type: 'racesFinished'
    }
  ]

  return (
    <div>
      <div
        className={cn(
          'rounded-t-xl p-4 text-center font-serif text-base sm:p-6 sm:text-lg',
          isLightColor(color) ? 'text-zinc-900' : 'text-white'
        )}
        style={{ background: color }}
      >
        {driver}
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2'>
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            comparison={getLegendaryComparison(stat.type, driverNumber, result)}
            isLast={idx === stats.length - 1}
            isSecondToLast={idx === stats.length - 2}
          />
        ))}
      </div>
    </div>
  )
}
