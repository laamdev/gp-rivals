import { NavLink } from '@/components/navigation/nav-link'

import { getSeasonRaces } from '@/lib/fetchers'
import { currentDate } from '@/lib/utils'

interface SeasonRacesNavProps {
  seasonSlug: string
  teamSlug: string
}

export const SeasonRacesNav = async ({
  seasonSlug,
  teamSlug
}: SeasonRacesNavProps) => {
  const result = await getSeasonRaces({ seasonSlug })

  if (!result) {
    return null
  }

  const { seasonRaces } = result

  return (
    <section className='flex gap-x-4 overflow-x-auto py-8'>
      <NavLink href={`/${seasonSlug}/team/${teamSlug}`} activeFilter={teamSlug}>
        Full Season
      </NavLink>

      {seasonRaces.map(race => {
        const raceDate = new Date(race.date)
        const isFutureRace = raceDate > currentDate

        return (
          <NavLink
            key={`${race.country}-${race.startDate}`}
            href={`/${seasonSlug}/team/${teamSlug}/gp/${race.Circuit.circuitId}`}
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
