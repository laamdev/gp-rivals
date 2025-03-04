import { cn, getLegendarySeasonComparison, isLightColor } from '@/lib/utils'

import { StatCard } from '@/components/legendary/stat-card'

interface DriverStatsProps {
  driverNumber: 1 | 2
  result: {
    year: number
    driverOne: {
      points: number
      wins: number
      poles: number
      podiums: number
      fastestLaps: number
      position: number
      races: number
      dnfs: number
    }
    driverTwo: {
      points: number
      wins: number
      poles: number
      podiums: number
      fastestLaps: number
      position: number
      races: number
      dnfs: number
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
  const driverData = driverNumber === 1 ? result.driverOne : result.driverTwo
  const stats = [
    {
      title: 'Championship Position',
      value: driverData.position,
      type: 'position'
    },
    {
      title: 'Points',
      value: driverData.points,
      type: 'points'
    },
    {
      title: 'Wins',
      value: driverData.wins,
      type: 'wins'
    },
    {
      title: 'Poles',
      value: driverData.poles,
      type: 'poles'
    },
    {
      title: 'Podiums',
      value: driverData.podiums,
      type: 'podiums'
    },
    {
      title: 'Fastest Laps',
      value: driverData.fastestLaps,
      type: 'fastestLaps'
    },
    {
      title: 'DNFs',
      value: driverData.dnfs,
      type: 'dnfs'
    },
    {
      title: 'Races',
      value: driverData.races,
      type: 'races'
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
            comparison={getLegendarySeasonComparison(
              stat.type,
              driverNumber,
              result
            )}
            isLast={idx === stats.length - 1}
            isSecondToLast={idx === stats.length - 2}
          />
        ))}
      </div>
    </div>
  )
}
