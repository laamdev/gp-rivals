import { NavLink } from '@/components/navigation/nav-link'

import { currentDate } from '@/lib/utils'
import { Race } from '@/api/types'

interface SeasonRacesNavProps {
  teamSlug: string
  seasonSlug: string
  currentGP?: string
  races: Race[]
}

export const SeasonRacesNav = async ({
  teamSlug,
  seasonSlug,
  currentGP,
  races
}: SeasonRacesNavProps) => {
  if (!races) return null

  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink
        href={`/${seasonSlug}/${teamSlug}`}
        activeFilter={!currentGP ? null : ''}
      >
        Full Season
      </NavLink>

      {races.map((race, idx) => {
        const raceDate = new Date(race.date)
        const isFutureRace = raceDate > currentDate
        const isActive = currentGP === race.Circuit.circuitId

        return (
          <NavLink
            key={idx}
            href={`/${seasonSlug}/${teamSlug}?gp=${race.Circuit.circuitId}`}
            activeFilter={isActive ? race.Circuit.circuitId : ''}
            disabled={isFutureRace}
          >
            {race.raceName}
          </NavLink>
        )
      })}
    </section>
  )
}
