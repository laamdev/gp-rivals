import { getComparison } from '@/lib/utils'

import { StatCard } from '@/components/global/stat-card'

interface RaceResult {
  position: string
  grid: string
  points: string
  laps: string
  status: string
  finishTime?: string
  fastestLap?: string
  fastestLapRank?: string
}

interface RaceResults {
  driverOne: RaceResult
  driverTwo: RaceResult
}

export const RaceDriverStats = ({
  driverNumber,
  result
}: {
  driverNumber: 1 | 2
  result: RaceResults
}) => {
  const driverData = driverNumber === 1 ? result.driverOne : result.driverTwo

  const stats = [
    {
      title: 'Position',
      value: driverData.position,
      type: 'position'
    },
    {
      title: 'Grid',
      value: driverData.grid,
      type: 'grid'
    },
    {
      title: 'Points',
      value: driverData.points,
      type: 'points'
    },
    {
      title: 'Laps',
      value: driverData.laps,
      type: 'laps'
    },
    {
      title: 'Finish Time',
      value: driverData.finishTime || 'DNF',
      type: 'finishTime'
    },
    {
      title: 'Fastest Lap',
      value: driverData.fastestLap || '-',
      type: 'fastestLap'
    }
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {stats.map((stat, idx) => (
        <StatCard
          key={idx}
          title={stat.title}
          value={stat.value}
          comparison={getComparison(stat.type, driverNumber, result)}
        />
      ))}
    </div>
  )
}
