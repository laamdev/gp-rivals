import { cn, getComparison, isLightColor } from '@/lib/utils'

import { StatCard } from '@/components/legendary/stat-card'

interface DriverStatsProps {
  driverNumber: 1 | 2
  result: {
    driverOne: {
      points: number
      wins: number
      poles: number
      podiums: number
      fastestLaps: number
      championships: number // Add championships
    }
    driverTwo: {
      points: number
      wins: number
      poles: number
      podiums: number
      fastestLaps: number
      championships: number // Add championships
    }
  }
  color: string
  driver: string
}

export const DriverStats = ({
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
      title: 'Total Points',
      value:
        driverNumber === 1 ? result.driverOne.points : result.driverTwo.points,
      type: 'points'
    },
    {
      title: 'Total Wins',
      value: driverNumber === 1 ? result.driverOne.wins : result.driverTwo.wins,
      type: 'wins'
    },
    {
      title: 'Total Poles',
      value:
        driverNumber === 1 ? result.driverOne.poles : result.driverTwo.poles,
      type: 'poles'
    },
    {
      title: 'Total Podiums',
      value:
        driverNumber === 1
          ? result.driverOne.podiums
          : result.driverTwo.podiums,
      type: 'podiums'
    },
    {
      title: 'Total Fastest Laps',
      value:
        driverNumber === 1
          ? result.driverOne.fastestLaps
          : result.driverTwo.fastestLaps,
      type: 'fastestLaps'
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
            comparison={getComparison(stat.type, driverNumber, result)}
          />
        ))}
      </div>
    </div>
  )
}
