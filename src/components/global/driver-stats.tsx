import { cn, formatPosition, getComparison, isLightColor } from '@/lib/utils'

import { StatCard } from '@/components/global/stat-card'

interface DriverStatsProps {
  driverNumber: 1 | 2
  result: any
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
      type: 'race'
    },
    {
      title: 'Qualifying Position Average',
      value:
        driverNumber === 1
          ? result.driverOneQualifyingAverage
          : result.driverTwoQualifyingAverage,
      type: 'qualifying'
    },
    {
      title: 'Pole to Win Ratio',
      value:
        driverNumber === 1
          ? `${result.driverOnePoleToWinRatio.toFixed(1)}%`
          : `${result.driverTwoPoleToWinRatio.toFixed(1)}%`,
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
