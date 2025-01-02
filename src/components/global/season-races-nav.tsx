import { NavLink } from '@/components/navigation/nav-link'

import { currentDate } from '@/lib/utils'

interface SeasonRacesNavProps {
  teamSlug: string
  seasonRaces: any
  seasonSlug: string
}

export const SeasonRacesNav = async ({
  teamSlug,
  seasonSlug,
  seasonRaces
}: SeasonRacesNavProps) => {
  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink href={`/${seasonSlug}/${teamSlug}`} activeFilter={teamSlug}>
        Full Season
      </NavLink>

      {seasonRaces.map(race => {
        const raceDate = new Date(race.date)
        const isFutureRace = raceDate > currentDate

        return (
          <NavLink
            key={`${race.country}-${race.startDate}`}
            href={`/${seasonSlug}/${teamSlug}/${race.Circuit.circuitId}`}
            activeFilter={race.Circuit.circuitId}
            disabled={isFutureRace}
          >
            {race.raceName}
          </NavLink>
        )
      })}
    </section>
  )
}
