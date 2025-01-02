import { cn, formatPosition, getComparison, isLightColor } from '@/lib/utils'

import { StatCard } from '@/components/global/stat-card'

interface DriverStatsProps {
  driverNumber: 1 | 2
  result: any
  color: string
  driver: string
  mode?: 'season' | 'race'
}

export const DriverStats = ({
  driverNumber,
  result,
  color,
  driver,
  mode = 'season'
}: DriverStatsProps) => {
  const seasonStats = [
    {
      title: 'Position',
      value:
        driverNumber === 1
          ? formatPosition(Number(result.driverOnePosition))
          : formatPosition(Number(result.driverTwoPosition)),
      type: 'position'
    },
    {
      title: 'Points',
      value:
        driverNumber === 1 ? result.driverOnePoints : result.driverTwoPoints,
      type: 'points'
    },
    {
      title: 'Wins',
      value: driverNumber === 1 ? result.driverOneWins : result.driverTwoWins,
      type: 'wins'
    },
    {
      title: 'Poles',
      value: driverNumber === 1 ? result.driverOnePoles : result.driverTwoPoles,
      type: 'poles'
    },
    {
      title: 'Podiums',
      value:
        driverNumber === 1 ? result.driverOnePodiums : result.driverTwoPodiums,
      type: 'podiums'
    },
    {
      title: 'Fastest Laps',
      value:
        driverNumber === 1
          ? result.driverOneFastestLaps
          : result.driverTwoFastestLaps,
      type: 'fastestLaps'
    },
    {
      title: 'Race Position Average',
      value:
        driverNumber === 1
          ? result.driverOneRaceAverage
          : result.driverTwoRaceAverage,
      type: 'raceAverage'
    },
    {
      title: 'Grid Position Average',
      value:
        driverNumber === 1
          ? result.driverOneGridAverage
          : result.driverTwoGridAverage,
      type: 'gridAverage'
    },
    {
      title: 'Pole to Win Ratio',
      value:
        driverNumber === 1
          ? `${result.driverOnePoleToWinRatio?.toFixed(2)}%`
          : `${result.driverTwoPoleToWinRatio?.toFixed(2)}%`,
      type: 'poleToWinRatio'
    },
    {
      title: 'Points per Race',
      value:
        driverNumber === 1
          ? `${result.driverOnePointsPerRace}`
          : `${result.driverTwoPointsPerRace}`,
      type: 'pointsPerRace'
    }
  ]

  const raceStats = [
    {
      title: 'Finish Position',
      value:
        driverNumber === 1
          ? formatPosition(Number(result.driverOne?.position))
          : formatPosition(Number(result.driverTwo?.position)),
      type: 'position'
    },
    {
      title: 'Grid Position',
      value:
        driverNumber === 1
          ? formatPosition(Number(result.driverOne?.grid))
          : formatPosition(Number(result.driverTwo?.grid)),
      type: 'grid'
    },
    {
      title: 'Points',
      value:
        driverNumber === 1
          ? result.driverOne?.points
          : result.driverTwo?.points,
      type: 'points'
    },
    {
      title: 'Laps',
      value:
        driverNumber === 1 ? result.driverOne?.laps : result.driverTwo?.laps,
      type: 'laps'
    },
    {
      title: 'Fastest Lap',
      value:
        driverNumber === 1
          ? result.driverOne?.fastestLap || '-'
          : result.driverTwo?.fastestLap || '-',
      type: 'fastestLap'
    },
    {
      title: 'Status',
      value:
        driverNumber === 1
          ? result.driverOne?.status
          : result.driverTwo?.status,
      type: 'status'
    }
  ]

  const stats = mode === 'season' ? seasonStats : raceStats

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
      <div className='grid sm:grid-cols-2'>
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.title}
            value={stat.value}
            comparison={getComparison(stat.type, driverNumber, result)}
            isLast={idx === stats.length - 1}
            isSecondToLast={idx === stats.length - 2}
          />
        ))}
      </div>
    </div>
  )
}
